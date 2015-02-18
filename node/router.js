var route = function(pathname, handlers, data, callback) {
    var pathParts = pathname.split('/');
    var service = pathParts[1];
    var result = { status: 500, message: "Internal server error", data: {} };

    // Prevent favicon logs
    if (service && service === "favicon.ico") {
        result = { status: 404, message: "No favicon", data: {} };
    };

    // Handle requests of our type
    if (pathParts.length >= 3) {
        var fun = pathParts[2];
        var params = pathParts.slice(3);

        if (service.length === 0) {
            result.status = 404;
            result.message = "Zero length service recieved, please provide a service as: host/{service}/{function}";
        } else if (fun.length === 0) {
            result.status = 404;
            result.message = "Zero length function recieved, please provide a function as: host/{service}/{function}";
        } else {
            var serviceImpl = handlers[service];
            if (serviceImpl) {
                var funImpl = serviceImpl[fun];

                if (typeof(funImpl) === "function") {
                    console.log("Calling: " + fun + " with params: ");
                    //params.push(data);
                    params.push(function(node) {
                        result.data = {
                            ip: node.ip,
                            port: node.port,
                            key: node.key
                        };
                        callback(result);
                    })
                    console.log(params);
                    result.status = 200;
                    result.message = "OK";
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
