var remoteNode = require('./RemoteNode');

var Chord = function (ip, port, key, m, k) {
    //var finger = [];
    this.successor = null;
    this.predecessor= null;

    this.ip = ip;
    this.port = port;
    this.key =  key;

    this.m = m; //Address bits
    this.k = k; //Address space (2^m)

    var thisNode = this;

    this.get_successor =  function(callback) {
        callback(thisNode.successor);
    };

    this.get_predecessor = function(callback) {
        callback(thisNode.predecessor);
    };

    this.find_successor = function(id, callback) {
        //Local call, should not fail
        thisNode.find_predecessor(id, function(node, err) {
            node.get_successor(callback);
        });
    }; 
    
    this.find_predecessor = function(id, callback) {
        if (thisNode.in_interval(id, thisNode.key, thisNode.successor.key)) {
            callback(thisNode);
        } else {
            //node.closest_preceding_finger(id).find_predecessor(callback);
            thisNode.successor.find_predecessor(id, function(node, err) {
                if (node) {
                    callback(node, err);
                } else {
                    //successor is probable lost
                    console.log("Error in find_predecessor");
                }
            });
        }
    };

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

    this.join = function(node) {
        if (node) {
            console.log("join with " + node.key);
            thisNode.init(node)
	    // move keys in (predecessor, node] from successor
        } else {
            console.log("Starting new Chord ring");
            thisNode.successor = thisNode;
	    thisNode.predecessor = thisNode;
            thisNode.stabilize();
        }
    };

    //initialize predecessor and successors
    this.init = function(node) {
        node.find_predecessor(thisNode.key, function(preNode, err) {
            if (preNode) {
                thisNode.predecessor = preNode;
                preNode.get_successor(function(succNode, err) {
                    if (succNode) {
                        thisNode.successor = succNode;
                        thisNode.stabilize();
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
    };

    this.stabilize = function() {
        if (thisNode.successor) {
            thisNode.successor.get_predecessor(function(node, err) {
                if(node) {
                    if(thisNode.in_interval(node.key, thisNode.key, thisNode.successor.key)) {
                        thisNode.successor = node;
                    }
                    thisNode.successor.notify(thisNode, function(_, err) {
                        if (err) {
                            console.log("Error can't notify successor");
                        }
                    });
                } else {
                    //Something wrong with successor
                    console.log("Error - successor gone");
                    thisNode.successor = thisNode.predecessor;
                }
            })
        }
        if (thisNode.predecessor) {
            thisNode.predecessor.get_successor(function(node, err) {
                if(node) {
                    if(thisNode.in_interval(node.key, thisNode.predecessor.key, thisNode.key)
                     && node.key != thisNode.key) {
                        thisNode.predecessor = node;
                    }
                    //Chord.predecessor
                } else {
                    //Something wrong with predecessor
                    console.log("Error - predecessor gone")
                    thisNode.predecessor = thisNode.successor;
                }
            })
        }
        setTimeout(thisNode.stabilize, 1000);
    };

    this.notify = function(node) {
        console.log("Notified with: " + node.key);
        if(thisNode.in_interval(node.key, thisNode.predecessor.key, thisNode.key)) {
            thisNode.predecessor = node;
        }
    };

    // a < k <= b mod k
    this.in_interval = function(k, a, b) {
        var key = k;
        var low = a;
        var high = b;
        //Handling overflow in address space
        if (high <= low) {
            high += thisNode.k;
            if (key <= low) {
                key += thisNode.k;
            }
        }
        return (low < key && key <= high);
    }
}

var ChordProxy = function(node) {
    this.get_successor = function(data, callback) {
        node.get_successor(callback)
    };
    this.get_predecessor = function(data, callback) {
        node.get_predecessor(callback)
    };
    this.find_successor =  function(data, callback) {
        node.find_successor(parseInt(data.id), callback);
    };
    this.find_predecessor =  function(data, callback) {
        node.find_predecessor(parseInt(data.id), callback);
    };
    this.notify = function(data, callback) {
        var json = JSON.parse(data.node);
        var rnode = new remoteNode.Node(json.ip, json.port, json.key);
        node.notify(rnode);
        callback();
    };
    this.get_node = function(node, data, callback) {
        callback({ip:node.ip, port:node.port, key:node.key})
    };
};


exports.Chord = Chord;
exports.ChordProxy = ChordProxy;