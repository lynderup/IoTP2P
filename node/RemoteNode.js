var http = require('http');

// TODO Handle callback structure!!!
var requestTemplate = function(fun, params, data, method, ip, port) {
    // Build the post string from an object
    var post_data = JSON.stringify(data);

    // An object of options to indicate where to post to
    var post_options = {
        host: ip,
        port: port,
        path: '/chord/' + fun + params,
        method: method,
        headers: {
            'Content-Type': 'application/json',
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

var Node = function(ip, port, key) {
    this.ip = ip;
    this.port = port;
    this.key = key;

    this.find_successor = function(id) {
        requestTemplate("find_successor", "/"+id, {}, "GET", ip, port);
    };

    this.find_predecessor = function(id) {
        requestTemplate("find_predecessor", "/"+id, {}, "GET", ip, port);
    };

    this.closest_preceding_finger = function(id) {
        requestTemplate("closest_preceding_finger", "/"+id, {}, "GET", ip, port);
    };

    // s is of type node
    this.update_finger_table = function(node, i) {
        requestTemplate("update_finger_table", "",
                        { node: nodeToJSON(node), index: i }, "POST", ip, port);
    };
    this.notify = function(node) {
        requestTemplate("notify", "", { node: nodeToJson(node) }, "POST", ip, port);
    };
}

var nodeToJSON = function(node) {
    var json = {
        ip: node.ip,
        port: node.port,
        key: node.key
    };
    return JSON.stringify(json);
}

var nodeFromJSON = function(json) {
    var node = JSON.parse(json);

    return new Node(node.ip, node.port, node.key);
}
// Stored for reference, shouldn't be needed, seems to be local only
//Node.prototype.join = function(node) {};
//Node.prototype.init_finger_table = function(node) {};
//Node.prototype.update_others = function() {};
//Node.prototype.join = function(node) {};
//Node.prototype.stabelize = function() {};
//Node.prototype.fix_fingers = function() {};

exports.Node = Node;