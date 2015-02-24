var remoteNode = require('./RemoteNode');

var Chord = function() {
    //var finger = [];
    this.successor = null;
    this.predecessor = null;

    this.ip = 0;
    this.port = 0;
    this.key = 0;

    this.m = 0; //Address bits
    this.k = 0; //Address space (2^m)

    this.get_successor = function(callback) {
        callback(this.successor);
    };

    this.get_predecessor = function(callback) {
        callback(this.predecessor);
    };

    this.find_successor = function(id, callback) {
        //Local call, should not fail
        this.find_predecessor(id, function(node, err) {
            node.get_successor(callback);
        });
    };

    this.find_predecessor = function(id, callback) {
        if (this.in_interval(id, this.key, this.successor.key)) {
            callback(this);
        } else {
            //node.closest_preceding_finger(id).find_predecessor(callback);
            this.successor.find_predecessor(id, function(node, err) {
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
            if (this.in_interval(node.key, this.key, id) && node.key != id) {

                return node;
            }
        }

        return this;
    },
    */

    this.join = function(node) {
        if (node) {
            console.log("join with " + node.key);
            this.init(node)
	    // move keys in (predecessor, node] from successor
        } else {
            console.log("Starting new this ring");
            this.successor = this;
	    this.predecessor = this;
            this.stabilize();
        }
    };

    //initialize predecessor and successors
    this.init = function(node) {
        node.find_predecessor(this.key, function(preNode, err) {
            if (preNode) {
                this.predecessor = preNode;
                preNode.get_successor(function(succNode, err) {
                    if (succNode) {
                        this.successor = succNode;
                        this.stabilize();
                    } else {
                        //Something wrong with preNode
                        console.log("Error in init");
                    }
                });
            } else {
                //Something wrong with node
                console.log("Error in init");
            }
        });
    };

    this.stabilize = function() {
        if (this.successor) {
            this.successor.get_predecessor(function(node, err) {
                if(node) {
                    if(this.in_interval(node.key, this.key, this.successor.key)) {
                        this.successor = node;
                    }
                    this.successor.notify(this, function(_, err) {
                        if (err) {
                            console.log("Error can't notify successor");
                        }
                    });
                } else {
                    //Something wrong with successor
                    console.log("Error - successor gone");
                    Chord.successor = Chord.predecessor;
                }
            });
        }
        if (this.predecessor) {
            this.predecessor.get_successor(function(node, err) {
                if(node) {
                    if(Chord.in_interval(node.key, Chord.predecessor.key, Chord.key)
                     && node.key != Chord.key) {
                        Chord.predecessor = node;
                    }
                    //Chord.predecessor
                } else {
                    //Something wrong with predecessor
                    console.log("Error - predecessor gone");
                    Chord.predecessor = Chord.successor;
                }
            });
        }
        setTimeout(Chord.stabilize, 1000);
    };

    this.notify = function(node) {
        console.log("Notified with: " + node.key);
        if(this.in_interval(node.key, this.predecessor.key, this.key)) {
            this.predecessor = node;
        }
    };

    // a < k <= b mod k
    this.in_interval = function(k, a, b) {
        var key = k;
        var low = a;
        var high = b;
        //Handling overflow in address space
        if (high <= low) {
            high += this.k;
            if (key <= low) {
                key += this.k;
            }
        }
        return (low < key && key <= high);
    };
};
exports.Chord = Chord;

//Proxies
exports.get_successor = function(data, callback) {Chord.get_successor(callback);};
exports.get_predecessor = function(data, callback) {Chord.get_predecessor(callback);};
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
exports.get_node = function(data, callback) {
  callback({ip:Chord.ip, port:Chord.port, key:Chord.key});
};
