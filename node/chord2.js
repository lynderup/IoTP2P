/*global nodeToSimple */
var remoteNode = require('./RemoteNode');
var http = require('https');
var application = require('./Application');

var Chord = function (ip, port, key, m, k, logger) {
    this.fingers = new Array(m);
    //this.successor = null;
    this.predecessor = null;

    this.applicationLayer = new application.Application(this);

    this.ip = ip;
    this.port = port;
    this.key =  key;

    this.m = m; //Address bits
    this.k = k; //Address space (2^m)

    this.stabilizeTimer = null;
    this.fixFingersTimer = null;

    var thisNode = this;
    if (!logger) {
        logger = console;
    }

    this.get_successor =  function(callback) {
        callback(thisNode.fingers[0]);
    };

    this.get_predecessor = function(callback) {
        callback(thisNode.predecessor);
    };

    this.find_successor = function(id, callback) {
        //Local call, should not fail
        thisNode.find_predecessor(id, function(node, err) {
            if(node) {
                node.get_successor(callback);
            } else {
                callback(null, err);
                //Error
                logger.log("Error in find_successor");
            }
        });
    };

    this.find_predecessor = function(id, callback) {
        if (thisNode.in_interval(id, thisNode.key, thisNode.fingers[0].key)) {
            callback(thisNode);
        } else {
            //thisNode.succcessor.find_predecessor
            thisNode.closest_preceding_finger(id).find_predecessor(id, function(node, err) {
                if (node) {
                    callback(node, err);
                } else {
                    callback(null, err);
                    //finger is probable lost
                    logger.log("Error in find_predecessor");
                }
            });
        }
    };


    this.closest_preceding_finger = function(id) {
        for (var i = thisNode.fingers.length - 1; i >= 0; --i) {
            var node = thisNode.fingers[i];
            if (node && thisNode.in_interval(node.key, thisNode.key, id) && node.key != id) {
                return node;
            }
        }
        return thisNode;
    };

    this.join = function(node) {
        if (node) {
            logger.log("join with " + node.key);
            thisNode.init(node);
	    // move keys in (predecessor, node] from successor
        } else {
            logger.log("Starting new Chord ring");
            //thisNode.successor = thisNode;
            thisNode.fingers[0] = thisNode;
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
                        //thisNode.successor = succNode;
                        thisNode.fingers[0] = succNode;
                        thisNode.stabilize();
                    } else {
                        //Something wrong with preNode
                        logger.log("Error - init - get_successor");
                    }
                });
                preNode.get_fingers(function(fingers, err) {
                    if (fingers) {
                        thisNode.fingers = fingers;
                        thisNode.fix_fingers();
                    } else {
                        //console.log("Error - init - get_fingers");
                    }
                });
            } else {
                //Something wrong with node
                logger.log(err);
                logger.log("Error in init");
            }
        });
    };

    this.stabilize = function() {
        if (thisNode.fingers[0]) {
            thisNode.fingers[0].get_predecessor(function(node, err) {
                if(node) {
                    if(thisNode.in_interval(node.key, thisNode.key, thisNode.fingers[0].key)) {
                        //console.log(node.key + " is now my successor");
                        thisNode.fingers[0] = node;
                    }
                    thisNode.fingers[0].notify(thisNode, function(_, err) {
                        if (err) {
                            logger.log("Error can't notify successor");
                        }
                    });
                } else {
                    //Something wrong with successor
                    logger.log("Error - successor gone");
                    thisNode.fingers[0] = thisNode.predecessor;
                }
            });
        }
        if (thisNode.predecessor) {
            thisNode.predecessor.get_successor(function(node, err) {
                if(node) {
                    if(thisNode.in_interval(node.key, thisNode.predecessor.key, thisNode.key)
                     && node.key != thisNode.key) {
                        //console.log(node.key + " is now my predecessor");
                        thisNode.predecessor = node;
                    }
                    //Chord.predecessor
                } else {
                    //Something wrong with predecessor
                    logger.log("Error - predecessor gone");
                    thisNode.predecessor = thisNode.fingers[0];
                }
            });
        }
        thisNode.stabilizeTimer = setTimeout(thisNode.stabilize, 1000);
    };

    this.notify = function(node) {
        //console.log("Notified with: " + node.key);
        if(thisNode.in_interval(node.key, thisNode.predecessor.key, thisNode.key)) {
            //console.log(node.key + " is now my predecessor");
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
    };

    this.close = function() {
        this.applicationLayer.close();
        clearTimeout(thisNode.fixFingersTimer);
        clearTimeout(thisNode.stabilizeTimer);
    };
}

var ChordProxy = function(node) {

    var nodeToSimple = function(node) {
        return {
            ip: node.ip,
            port: node.port,
            key: node.key
        };
    };

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

    //Applications layer functions
    this.get_apps = function(data, callback) {
        node.applicationLayer.get_apps(callback);
    };
    this.register_app = function(data, callback) {
        node.applicationLayer.register_source(data.url);
        callback();
    };
    this.addSource = function(source, callback) {
        node.applicationLayer.addSource(source);
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
        callback(fingers);
    };
};


exports.Chord = Chord;
exports.ChordProxy = ChordProxy;
