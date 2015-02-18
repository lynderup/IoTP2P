var http = require('http');
var url = require('url');
var qs = require('querystring');

var start = function(route, handlers, port) {
  port = port || 8888;

  var onRequest = function(request, response) {
    var parsedUrl = url.parse(request.url, true);
    var pathname = parsedUrl.pathname;
    var body = '';
    request.on('data', function(data) {
      //console.log("Data received: " + data);
      body += data;

      if (body.length > 1e6) { // Prevent flooding, 1 mb data or more
        request.connection.destroy();
      }
    });


    request.on('end', function() {
      var data = {};
      if(request.method == "POST") {
        data = JSON.parse(body);
      }
      else {
        data = parsedUrl.query;
      }
      //console.log("Routing data:");
      //console.log(data);
      route(pathname, handlers, data, function(result) {

          response.writeHead(result.status, {"Content-Type": "application/json"});

          if (result.status === 200) {
            response.write(JSON.stringify({ data: result.data }));
          } else {
            response.write(JSON.stringify({ error: result.message }));
          }
          response.write("\n");
          response.end();
          request.connection.destroy();
        });
      });
    };

  return http.createServer(onRequest).listen(port);
};

exports.start = start;
