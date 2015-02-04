var http = require('http');
var url = require('url');

var start = function(route) {
    var onRequest = function(request, response) {
	var parsedUrl = url.parse(request.url);
	var pathname = parsedUrl.pathname;

	route(pathname);

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello world");
	response.end();
    };

    http.createServer(onRequest).listen(8888);

    console.log("Server has started, press C-c to exit");
};

exports.start = start;
