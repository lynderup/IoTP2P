var http = require('http');
var url = require("url");

http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    if (pathname == "/app") {
        response.writeHeader(200, {"Content-Type": "application/json"})
        var data = {
            key : 500,
            name : "Test App",
            content : "testtest",
            appurl : "http://localhost:8090/data"
        }
        response.write(JSON.stringify(data))
        
    }
    else if (pathname == "/app") {
        response.writeHeader(200, {"Content-Type": "application/json"})
        var data = {
            data : "testtest"
        }
        response.write(JSON.stringify(data))
    }
    response.end();
}).listen(8090)