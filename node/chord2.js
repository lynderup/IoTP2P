var remoteNode = require('RemoteNode');

var Chord = {
    //var finger = [];
    successor: null,
    predecessor: null,

    ip: 0,
    port: 0,
    key: 0,

    m: 0, //Address bits
    k: 0, //Address space (2^m)

    get_successor: function(callback) {
        callback(Chord.successor);
    },

    get_predecessor: function(callback) {
        callback(Chord.predecessor);
    },

    find_successor: function(id, callback) {
        Chord.find_predecessor(id, function(node) {
            node.get_successor(callback);
        });
    }, 
    
    find_predecessor: function(id, callback) {
        Chord.get_successor(function(successor) {
            var i = id;
            if (typeof(i) == "string") {
                i = parseInt(id);
            }

            if (Chord.in_interval(Chord.key, i, successor.key) {
                callback(Chord);
            } else {
                //node.closest_preceding_finger(id).find_predecessor(callback);
                successor.find_predecessor(id, callback);
            }
        });
    },

    /*
    closest_preceding_finger: function(id) {
        for (var i = finger.length - 1; i >= 0; --i) {
            
            var node = finger[i];
            if (Chord.in_interval(node.key, Chord.key, id) && node.key != id) {
                
                return node;
            }
        }
        
        return Chord;
    },
    */

    join: function(node) {
        if (node) {
            console.log("join with " + node.key);
            Chord.init(node)
	    Chord.update_others();
	    // move keys in (predecessor, node] from successor
        } else {
            console.log("Starting new Chord ring");
            Chord.successor = Chord;
	    Chord.predecessor = Chord;
        }
    },

    //initialize predecessor and successors
    init: function(node) {
        node.find_predecessor(Chord.key, function(preNode) {
            Chord.predecessor = preNode;
            preNode.get_successor(function(succNode) {
                Chord.successor = succNode;  
            })
        })
    },

    stabilize: function() {
        Chord.successor.get_predecessor(function(node) {
            if(Chord.in_interval(node.key, Chord.key, Chord.successor.key) {
                Chord.successor = node;
            }
            Chord.successor.notify(Chord);
        })
    },

    notify: function(node) {
        if(Chord.in_interval(node.key, Chord.predecessor.key, Chord.key)) {
            Chord.predecessor = node;
        }
    },

    // a < k <= b mod k
    in_interval: function(k, a, b) {
        //Handling overflow in address space
        if (b <= a) {
            b += Chord.k;
            if (k <= a) {
                k += Chord.k;
            }
        }
        return (a < k && k <= b);
    }
}
exports.Chord = Chord;

//Proxies
exports.get_successor = function(data, callback) {Chord.get_successor(callback)};
exports.get_predecessor = function(data, callback) {Chord.get_predecessor(callback)};
exports.find_successor =  function(data, callback) {
    Chord.find_successor(parseInt(data.id), callback);
};
exports.find_predecessor =  function(data, callback) {
    Chord.find_predecessor(parseInt(data.id), callback);
};
exports.notify = function(data, callback) {
    var node = new remoteNode.Node(data.node.ip, data.node.port, data.note.key);
    Chord.notify(node);
};