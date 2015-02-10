var http = require('http');
var url = require('url');
var qs = require('querystring')

var start = function(route) {
    var onRequest = function(request, response) {
	var parsedUrl = url.parse(request.url);
	var pathname = parsedUrl.pathname;

	route(pathname);

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello world");
	response.end();

      if (request.method = "POST") {
        var body = '';
        request.on('data', function(data) {
          body += data;

          if (body.length > 1e6) { // Prevent flooding, 1 mb data or more
            request.connection.destroy;
          }
        });

        var POST = qs.parse(body);
      }
    };

    http.createServer(onRequest).listen(8888);

    console.log("Server has started, press C-c to exit");
};

exports.start = start;
