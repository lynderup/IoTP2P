var http = require('http');
var url = require("url");

http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    if (pathname == "/app") {
        response.writeHeader(200, {"Content-Type": "application/json"})
        var data = {
            result : JSON.stringify({
                key : 500,
                name : "Test App",
                contentUrl : "http://localhost:8090/data"
            })
        }
        response.write(JSON.stringify(data))
        
    }
    else if (pathname == "/data") {
        response.writeHeader(200, {"Content-Type": "application/json"})
        var data = {
            result : {
                temp : 20.7
            }
        }
        response.write(JSON.stringify(data))
    }
    response.end();
}).listen(8090)