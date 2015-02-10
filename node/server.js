var http = require('http');
var url = require('url');

var start = function(route, handlers) {
  var onRequest = function(request, response) {
    var parsedUrl = url.parse(request.url);
    var pathname = parsedUrl.pathname;
    
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("<!DOCTYPE html>");
    response.write("<html>");
    response.write("\t<head>");
    response.write("\t\t<title>dIoT</title>");
    response.write("\t</head>");
    response.write("\t<body>");
    
    route(pathname, handlers);

    response.write("/t</body>");
    response.write("</html>");
    
    response.end();
  };
  
  http.createServer(onRequest).listen(8888);
  
  console.log("Server has started, press C-c to exit");
};

exports.start = start;
