var http = require('http');
var qs = require('querystring');

// TODO Handle callback structure!!!
var requestTemplate = function(fun, data, method, ip, port, callback) {
    
    var params = "";
    if (method == "GET") {
        params = "?"+qs.stringify(data);
    }

    // Build the post string from an object
    var post_data = JSON.stringify(data);
    var data_length = 0;
    if (method == "POST") {
        data_length = post_data.length;
    }

    // An object of options to indicate where to post to
    var post_options = {
        host: ip,
        port: port,
        path: '/chord/' + fun + params,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data_length
        }
    };

    // Set up the request
    var req = http.request(post_options, function(res) {
                  res.setEncoding('utf8');
                       if(callback) {
                           var recievedData = "";
                           res.on('data', function (chunk) {
                               recievedData += chunk;
                               //console.log('Response: ' + chunk);
                           });
                           res.on('end', function() {
                               callback(JSON.parse(recievedData).data, null);
                           });
                       }
                   });
    req.on('error', function(e) {
        callback(null, e);
    })

    if (method == "POST") {

        // post the data
        req.write(post_data);
    }
    req.end();
};

var Node = function(ip, port, key) {
    this.ip = ip;
    this.port = port;
    this.key = key;

    this.get_successor = function(callback) {
        requestTemplate("get_successor", {},
                        "GET", ip, port, augmentCallbackToCreateNode(callback));
    }

    this.get_predecessor = function(callback) {
        requestTemplate("get_predecessor", {},
                        "GET", ip, port, augmentCallbackToCreateNode(callback));
    }

    this.find_successor = function(id, callback) {
        requestTemplate("find_successor", {id: id},
                        "GET", ip, port, augmentCallbackToCreateNode(callback));
    };

    this.find_predecessor = function(id, callback) {
        requestTemplate("find_predecessor", {id: id},
                        "GET", ip, port, augmentCallbackToCreateNode(callback));
    };

/*
    this.closest_preceding_finger = function(id, callback) {
        requestTemplate("closest_preceding_finger", {id: id},
                        "GET", ip, port, augmentCallbackToCreateNode(callback));
    };
    

    // s is of type node
    this.update_finger_table = function(node, i) {
        requestTemplate("update_finger_table", "",
                        { node: nodeToJSON(node), index: i }, "POST", ip, port);
    };
*/

    this.notify = function(node, callback) {
        requestTemplate("notify", { node: nodeToSimple(node) }, "POST", ip, port, callback);
    };
}
var dummy = new Node("127.0.0.1","4321","42");

var augmentCallbackToCreateNode = function(callback) {
    return function(node, err) {
        if(node) {
            callback(new Node(node.ip, node.port, node.key), err);
        } else {
            callback(null, err);
        }
    }
}

var nodeToSimple = function(node) {
    return {
        ip: node.ip,
        port: node.port,
        key: node.key
    };
}

// Stored for reference, shouldn't be needed, seems to be local only
//Node.prototype.join = function(node) {};
//Node.prototype.init_finger_table = function(node) {};
//Node.prototype.update_others = function() {};
//Node.prototype.join = function(node) {};
//Node.prototype.stabelize = function() {};
//Node.prototype.fix_fingers = function() {};

exports.Node = Node;