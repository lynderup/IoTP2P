/*global nodeToSimple */
var remoteNode = require('./RemoteNode');

var Chord = function (ip, port, key, m, k) {
    this.fingers = new Array(m);
    this.successor = null;
    this.predecessor= null;

    this.ip = ip;
    this.port = port;
    this.key =  key;

    this.m = m; //Address bits
    this.k = k; //Address space (2^m)

    this.stabilizeTimer = null;
    this.fixFingersTimer = null;

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
            thisNode.fix_fingers();
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
                        console.log("Error - init - get_successor");
                    }
                });
                preNode.get_fingers(function(fingers, err) {
                    if (fingers) {
                        thisNode.fingers = fingers;
                        thisNode.fix_fingers();
                    } else {
                        console.log("Error - init - get_fingers");
                    }
                });
            } else {
                //Something wrong with node
                console.log("Error in init");
            }
        });
    };

    this.stabilize = function() {
        if (thisNode.successor) {
            thisNode.successor.get_predecessor(function(node, err) {
                if(node) {
                    if(thisNode.in_interval(node.key, thisNode.key, thisNode.successor.key)) {
                        console.log(node.key + " is now my successor");
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
                        console.log(node.key + " is now my predecessor");
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
        thisNode.stabilizeTimer = setTimeout(thisNode.stabilize, 1000);
    };

    this.notify = function(node) {
        //console.log("Notified with: " + node.key);
        if(thisNode.in_interval(node.key, thisNode.predecessor.key, thisNode.key)) {
            console.log(node.key + " is now my predecessor");
            thisNode.predecessor = node;
        }
    };

    var index = 0;
    this.fix_fingers = function() {
        var indexKey = (Math.pow(2, index) + thisNode.key) % thisNode.k;

        //index can change, and will, before callback
        (function(i) {
            //local call. callback is only called if everything went ok (yet)
            thisNode.find_successor(indexKey, function(node, err) {
                thisNode.fingers[i] = node;
            });
        })(index);
        
        index = (index + 1) % thisNode.m;
        thisNode.fixFingersTimer = setTimeout(thisNode.fix_fingers, 1000);
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

    this.stop = function() {
        clearTimeout(thisNode.fixFingersTimer);
        clearTimeout(thisNode.stabilizeTimer);
    }
}

var ChordProxy = function(node) {

    var nodeToSimple = function(node) {
        return {
            ip: node.ip,
            port: node.port,
            key: node.key
        };
    }

    this.get_successor = function(data, callback) {
        node.get_successor(function(node) {
            callback(nodeToSimple(node));
        });
    };
    this.get_predecessor = function(data, callback) {
        node.get_predecessor(function(node) {
            callback(nodeToSimple(node));
        });
    };
    this.find_successor =  function(data, callback) {
        node.find_successor(parseInt(data.id), function(node) {
            callback(nodeToSimple(node));
        });
    };
    this.find_predecessor =  function(data, callback) {
        node.find_predecessor(parseInt(data.id), function(node) {
            callback(nodeToSimple(node));
        });
    };
    this.notify = function(data, callback) {
        var rnode = new remoteNode.Node(data.node.ip, data.node.port, data.node.key);
        node.notify(rnode);
        callback();
    };

    //Proxy only functions
    this.get_key = function(data, callback) {
        callback(node.key);
    };

    this.get_fingers = function(data, callback) {
        var fingers = [];

        var i;
        for (i = 0; i < node.fingers.length; i++) {
            var finger = node.fingers[i];
            if(finger) {
                fingers[i] = nodeToSimple(finger);
            } else {
                fingers[i] = null;
            }
        }
        callback(fingers)
    };
};


exports.Chord = Chord;
exports.ChordProxy = ChordProxy;