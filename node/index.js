var server = require('./server');
var router = require('./router');
var chord = require('./chord2');
var test = require('./test');
var remoteNode = require('./RemoteNode');
var crypto = require('crypto');

var shasummer = function(data) {
  var shasum = crypto.createHash('sha256');
  shasum.update(data);
  return shasum.digest("hex");
};

var m = 10; //address bits
var k = Math.pow(2, m); //0-k address space

var computeKey = function(ip, port) {
    var hex = shasummer(ip+port).substring(0,m);
    return parseInt(hex,16) % k;
};

var args = process.argv.slice(2);

var ip = "127.0.0.1"
var port = args[0];
var key = computeKey(ip, port);

var chordNode = new chord.Chord(ip, port,key, m, k);

console.log("starting on port " + port);
console.log("With key: " + key);

if(args.length >= 2) {
    var node = new remoteNode.Node("127.0.0.1", args[1], computeKey("127.0.0.1",args[1]));
    chordNode.join(node)
} else {
    chordNode.join();
};

var handlers = {};
handlers['chord'] = new chord.ChordProxy(chordNode);

server.start(router.route, handlers, port);
