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
    for (i = m; i>0; i--) {
	if (finger[i].node $\in$ [this, id]) {
	    return finger[i].node; // Gade vide hvad hende der modtager finger hedder?
	}
    }

    return this;
};

exports.find_successor = find_successor;
exports.find_predecessor = find_predecessor;
exports.closest_preceding_finger = closest_preceding_finger;
