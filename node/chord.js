var http = require('http');
var qs = require('querystring');

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
var Node = function(id) {
  this.id = id;
};
Node.prototype.find_successor = function(id) {
  requestTemplate("find_successor", "/id", {}, "GET");
};
Node.prototype.find_predecessor = function(id) {
  requestTemplate("find_predecessor", "/id", {}, "GET");
};
Node.prototype.closest_preceding_finger = function(id) {
  requestTemplate("closest_preceding_finger", "/id", {}, "GET");
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

// Should probably be a list or set
var successor = finger[0].node; // #define successor finger[1].node
var finger = [];
var predecessor;

var find_successor = function(id) {
    var node = find_predecessor(id);
    return node.successor;
};

var find_predecessor = function(id) {
    var node = this; // pseudo-code does: n.find_predecessor(id) { n' = n;....

    while (id $\notin$ [node, node.successor]) {
	node = node.closest_preceding_finger(id);
    }

    return node;
};

var closest_preceding_finger = function(id) {
    for (var i = m; i>0; i--) {
	if (finger[i].node $\in$ [this, id]) {
	    return finger[i].node; // Gad vide hvad hende der modtager finger hedder?
	}
    }

    return this;
};

var join = function(node) {
    if (node) {
	init_finger_table(node);
	update_others();
	// move keys in (predecessor, node] from successor
    } else {
	for (var i=0; i<m; i++) {
	    finger[i].node = node;
	}

	predecessor = node;
    }
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
var init_finger_table = function(node) {
    finger[0].node = node.find_successor(finger[0].start);
    successor = predecessor.successor;
    successor.predecessor = node;

    for (var i=0; i<(m-1); i++) {
	if (finger[i+1].start $\in$ [this.finger[i].node]) {
	    finger[i+1].node = finger[i].node;
	} else {
	    finger[i+1].node = node.find_successor(finger[i+1].start);
	}
    }
};

// update all nodes whose finger
// tables should refer to this
var update_others = function() {
    for (var i=0; i<m; i++) {
	// find last node p whose ith finger might be n
	var p = find_predecessor(this-2^(i-1));
	p.update_finger_table(this, i);
    }
};

// if s is ith finger of this update this' finger table
var update_finger_table = function(s, i) {
    if (s $\in$ [this, finger[i].node]) {
	finger[i].node = s;
	p = predecessor; // get first node preceding this
	p.update_finger_table(s, i);
    }
};

var join = function(node) {
  predecessor = nil;
  successor = node.find_successor();
};

// Periodically verify this nodes immediate successor,
// and tell it about this node
var stabelize = function() {
  var x = successor.predecessor;
  if (x $\in$ [this, successor]) {
    successor = x;
  }

  successor.notify(this);
};

// node might be our predecessor
var notify = function(node) {
  // remember null and undefined is falsy, original code says: predecessor = nil
  if (!predecessor || node $\in$ [predecessor, this]) {
    predecessor = node;
  }
};

// periodically refresh table entries
var fix_fingers = function() {
  var i = random index > 1 into finger[];
  finger[i].node = find_successor(finger[i].start);
};


exports.find_successor = find_successor;
exports.find_predecessor = find_predecessor;
exports.closest_preceding_finger = closest_preceding_finger;
