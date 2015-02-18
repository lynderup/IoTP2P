var remoteNode = require('./RemoteNode');

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
        //Local call, should not fail
        Chord.find_predecessor(id, function(node, err) {
            node.get_successor(callback);
        });
    }, 
    
    find_predecessor: function(id, callback) {
        if (Chord.in_interval(id, Chord.key, Chord.successor.key)) {
            callback(Chord);
        } else {
            //node.closest_preceding_finger(id).find_predecessor(callback);
            Chord.successor.find_predecessor(id, function(node, err) {
                if (node) {
                    callback(node, err);
                } else {
                    //successor is probable lost
                    console.log("Error in find_predecessor");
                }
            });
        }
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
	    // move keys in (predecessor, node] from successor
        } else {
            console.log("Starting new Chord ring");
            Chord.successor = Chord;
	    Chord.predecessor = Chord;
            Chord.stabilize();
        }
    },

    //initialize predecessor and successors
    init: function(node) {
        node.find_predecessor(Chord.key, function(preNode, err) {
            if (preNode) {
                Chord.predecessor = preNode;
                preNode.get_successor(function(succNode, err) {
                    if (succNode) {
                        Chord.successor = succNode;
                        Chord.stabilize();
                    } else {
                        //Something wrong with preNode
                        console.log("Error in init");
                    }
                })
            } else {
                //Something wrong with node
                console.log("Error in init");
            }
        })
    },

    stabilize: function() {
        if (Chord.successor) {
            Chord.successor.get_predecessor(function(node, err) {
                if(node) {
                    if(Chord.in_interval(node.key, Chord.key, Chord.successor.key)) {
                        Chord.successor = node;
                    }
                    Chord.successor.notify(Chord, function(_, err) {
                        if (err) {
                            console.log("Error can't notify successor");
                        }
                    });
                } else {
                    //Something wrong with successor
                    console.log("Error - successor gone");
                    Chord.successor = Chord.predecessor;
                }
            })
        }
        if (Chord.predecessor) {
            Chord.predecessor.get_successor(function(node, err) {
                if(node) {
                    if(Chord.in_interval(node.key, Chord.predecessor.key, Chord.key)
                     && node.key != Chord.key) {
                        Chord.predecessor = node;
                    }
                } else {
                    //Something wrong with predecessor
                    console.log("Error - predecessor gone")
                    Chord.predecessor = Chord.successor;
                }
            }
        }
        setTimeout(Chord.stabilize, 1000);
    },

    notify: function(node) {
        console.log("Notified with: " + node.key);
        if(Chord.in_interval(node.key, Chord.predecessor.key, Chord.key)) {
            Chord.predecessor = node;
        }
    },

    // a < k <= b mod k
    in_interval: function(k, a, b) {
        var key = k;
        var low = a;
        var high = b;
        //Handling overflow in address space
        if (high <= low) {
            high += Chord.k;
            if (key <= low) {
                key += Chord.k;
            }
        }
        return (low < key && key <= high);
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
    json = JSON.parse(data.node);
    var node = new remoteNode.Node(json.ip, json.port, json.key);
    Chord.notify(node);
    callback();
};