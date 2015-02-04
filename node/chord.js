// TODO the following is only stubs following the pseudo-code from the article, no actual implementation

// Note about notation all n is changed to node, so the code is descriptive
// node.foo() is a remote method/function call (as per spec)
// node.bar is a remove variable lookup (as per spec)

var find_successor = function(id) {
    var node = find_predecessor(id);
    return node.successor;
};

var find_predecessor = function(id) {
    var node = this; // pseudo-code does: n.find_predecessor(id) { n' = n;....
    
    while (id $\notin$ [node,node.successor]) {
	node = node.closest_preceding_finger(id);
    }

    return node;
};

var closest_preceding_finger = function(id) {
    for (var i = m; i>0; i--) {
	if (finger[i].node $\in$ [this, id]) {
	    return finger[i].node; // Gade vide hvad hende der modtager finger hedder?
	}
    }

    return this;
};

var successor = finger[0].node; // #define successor finger[1].node

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

exports.find_successor = find_successor;
exports.find_predecessor = find_predecessor;
exports.closest_preceding_finger = closest_preceding_finger;
