var http = require('http');
var qs = require('querystring');
var crypto = require('crypto');

var shasummer = function(data) {
  var shasum = crypto.createHash('sha256');
  shasum.update(data);
  return shasum.digest("hex");
};

// TODO Handle callback structure!!!
var requestTemplate = function(fun, params, data, method) {
  // Build the post string from an object
  var post_data = qs.stringify(data);

  // An object of options to indicate where to post to
  var post_options = {
    host: '',
    port: '8888',
    path: '/chord/' + fun + params,
    method: method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
    });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
};

// TODO how to post node?
// TODO successor should be defined in this I believe
var Node = function(id) {
  this.id = id;
};
Node.prototype.find_successor = function(id) {
  requestTemplate("find_successor", "/"+id, {}, "GET");
};
Node.prototype.find_predecessor = function(id) {
  requestTemplate("find_predecessor", "/"+id, {}, "GET");
};
Node.prototype.closest_preceding_finger = function(id) {
  requestTemplate("closest_preceding_finger", "/"+id, {}, "GET");
};
// s is of type node
Node.prototype.update_finger_table = function(s, i) {
  requestTemplate("update_finger_table", "", { node: s, index: i}, "POST");
};
Node.prototype.notify = function(node) {
  requestTemplate("notify", "", { node: node }, "POST");
};

// Stored for reference, shouldn't be needed, seems to be local only
//Node.prototype.join = function(node) {};
//Node.prototype.init_finger_table = function(node) {};
//Node.prototype.update_others = function() {};
//Node.prototype.join = function(node) {};
//Node.prototype.stabelize = function() {};
//Node.prototype.fix_fingers = function() {};

// TODO the following is only stubs following the pseudo-code from the article, no actual implementation
// Note about notation all n is changed to node, so the code is descriptive
// node.foo() is a remote method/function call (as per spec)
// node.bar is a remove variable lookup (as per spec)




var Chord = function() {
  this.id = 42; // Set this in a sane way
  this.finger = [];
  this.predecessor = null;

  // #define successor finger[1].node
  // m bit array where at node n, finger[i] = successor(n+Math.pow(2, i-1))
  // a finger entry contains id + ip:port
  // { start: , interval: , node: } // note node is sometimes referred to as successor in text
  // finger[i].interval = [finger[i].start...finger[i+1].start)

  this.m = 42; // Probably hash bit count
  this.k = Math.pow(2, m);
  this.successor = this.finger[0].node;
};



// Nah, I didn't just accidentally find someone elses implementation
// https://github.com/optimizely/chord/blob/master/chord.js#L133
Chord.prototype.in_range = function() {
};

// ID is a node ID
Chord.prototype.find_successor = function(id) {
  var node = this.find_predecessor(id);
  return node.successor;
};

Chord.prototype.find_predecessor = function(id) {
  var node = this;
  // The ID must be the key we're looking for
  var nodes = [node.successor.key, node.key];

  // Their definition of sets seems to be broken, we may need to fix this
  while (nodes.indexOf(id) >= 0) {
    node = node.closest_preceding_finger(id);
    nodes = [node.successor.key, node.key];
  }

  return node;
};

Chord.prototype.closest_preceding_finger = function(id) {
  // Again their sets looks broken
  // I suspect that they intend to look at intervals
  var nodes = [this.key, id];
  for (var i = this.finger.length; i>=0; --i) {
    if (nodes.indexOf(this.finger[i].node )) {
      return this.finger[i].node;
    }
  }

  return this;
};

Chord.prototype.join = function(node) {
    if (node) {
	this.init_finger_table(node);
	this.update_others();
	// move keys in (predecessor, node] from successor
    } else {
//	for (var i=0; i<m; i++) {
//	    finger[i].node = node;
//	}

	this.predecessor = node;
    }
};

// Check this
Chord.prototype.join2 = function(node) {
  this.predecessor = null;
  this.successor = node.find_successor();
};

// Good detail from article
/*
As a practical optimization, a newly joined node n can ask an
immediate neighbor for a copy of its complete finger table and its
predecessor. n can use the contents of these tables as hints to help
it find the correct values for its own tables, since n’s tables will be
similar to its neighbors’. This can be shown to reduce the time to
fill the finger table to O(log N ).
*/

// initialize finger table of local node
// node is an arbitrary node already in the network
Chord.prototype.init_finger_table = function(node) {
//    finger[0].node = node.find_successor(finger[0].start);
//    successor = predecessor.successor;
//    successor.predecessor = node;

//    for (var i=0; i<(m-1); i++) {
//	if (finger[i+1].start $\in$ [this.finger[i].node]) {
//	    finger[i+1].node = finger[i].node;
//	} else {
//	    finger[i+1].node = node.find_successor(finger[i+1].start);
//	}
//    }
};

// update all nodes whose finger
// tables should refer to this
Chord.prototype.update_others = function() {
    for (var i=0; i<m; i++) {
	// find last node p whose ith finger might be n
	var p = this.find_predecessor(this-2^(i-1));
	p.update_finger_table(this, i);
    }
};

// if s is ith finger of this update this' finger table
Chord.prototype.update_finger_table = function(s, i) {
//    if (s $\in$ [this, finger[i].node]) {
//	finger[i].node = s;
//	p = predecessor; // get first node preceding this
//	p.update_finger_table(s, i);
//    }
};

// Periodically verify this nodes immediate successor,
// and tell it about this node
Chord.prototype.stabelize = function() {
  var x = this.successor.predecessor;
  var nodes = this.successor;
  nodes.push(this);

  if (nodes.indexOf(x) >= 0) {
    this.successor = x;
  }

  this.successor.notify(this);
};

// node might be our predecessor
Chord.prototype.notify = function(node) {
  // remember null and undefined is falsy, original code says: predecessor = nil
  var nodes = [this.predecessor, this];
  if (!this.predecessor || nodes.indexOf(node) >= 0) {
    this.predecessor = node;
  }
};

// periodically refresh table entries
Chord.prototype.fix_fingers = function() {
//  var i = random index > 1 into finger[];
//  finger[i].node = find_successor(finger[i].start);
};

// No pseudo code. Yields IP for responsible key (and port?)
Chord.prototype.lookup = function() {
};

exports.Chord = Chord;
exports.foo = 3;
