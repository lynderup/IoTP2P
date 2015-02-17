
//var finger = [];
var successor;
var predecessor;
var key;

var find_successor = function(id) {
    var node = find_predecessor(id);
    return node.successor;
};

var find_predecessor = function(id) {
    var node = this;

    while (!(node.key < id && id <= node.successor.key)) {
        //node = node.closest_preceding_finger(id);
        node = node.successor;
    }

    return node;
};

/*
var closest_preceding_finger = function(id) {
    for (var i = finger.length - 1; i >= 0; --i) {

        var node = finger[i];
        if (this.key < node.key && node.key < id) {
            
            return node;
        }
    }

    return this;
};
*/

var join = function(node) {
    if (node) {
        init(node)
	update_others();
	// move keys in (predecessor, node] from successor
    } else {
        successor = this;
	predecessor = this;
    }
};

//initialize predecessor and successors
var init = function(node) {
    predecessor = node.find_predecessor(this.key);
    successor = predecessor.successor;
}

var update_others = function() {
    successor.predecessor = this;
    predecessor.successor = this;
};