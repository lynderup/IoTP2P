var fs = require('fs');
var route = function(pathname, handlers, data, callback) {
    var pathParts = pathname.split('/');
    var service = pathParts[1];
    var result = { status: 500, message: "Internal server error", data: {} };

    // Prevent favicon logs
    if (service && service === "favicon.ico") {
        result = { status: 404, message: "No favicon", data: {} };
    };
    
    if (service === "index.html" || service === "") {
	result.status = 200;
	
	fs.readFile("./html/index.html", function(err, html){
	    if(err){
		throw err;
	    }
	    result.contentType = "text/html";
	    result.data = html;		
	    callback(result);
	})

        return;
    };

    if (service === "index.js") {
	result.status = 200;
	
	fs.readFile("./html/index.js", function(err, js){
	    if(err){
		throw err;
	    }
	    result.contentType = "text/javascript";
	    result.data = js;		
	    callback(result);
	})

        return;        
    };

    if (service === "style.css") {
	result.status = 200;
	
	fs.readFile("./html/style.css", function(err, css){
	    if(err){
		throw err;
	    }
	    result.contentType = "text/css";
	    result.data = css;		
	    callback(result);
	})

        return;        
    };

    // Handle requests of our type
    if (pathParts.length >= 3) {
        var fun = pathParts[2];

        if (fun.length === 0) {
            result.status = 404;
            result.message = "Zero length function recieved, please provide a function as: host/{service}/{function}";
        } else {
            var serviceImpl = handlers[service];
            if (serviceImpl) {
                var funImpl = serviceImpl[fun];

                if (typeof(funImpl) === "function") {
                    //console.log("Calling: " + fun + " with params: ");
                    var params = [];
                    params.push(data);
                    params.push(function(data) {
                        if(data) {
                            result.data = data;
                        }
                        result.status = 200;
                        result.message = "OK";
                        result.contentType = "application/json";

                        callback(result);
                    })
                    funImpl.apply(service, params);
                } else {
                    result.status = 404;
                    result.message = "The requested function '" + fun + "' doesn't exist or is not a function.";
                }
            } else {
                result.status = 404;
                result.message = "Service '" + service + "' is unknown to the system.";
            }
        }
    } else {
        result.status = 404;
        result.message = "Wrong length recieved, not a valid url. Please request as: host/{service}/{function}";
    }

    if(result.status != 200) {
        callback(result);
    }
};

exports.route = route;
