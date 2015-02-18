var server = require('./server');
var router = require('./router');
var Chord = require('./chord2').Chord;
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

var handlers = {};
handlers['test'] = test;

var args = process.argv.slice(2);


Chord.m = m;
Chord.k = k;
Chord.ip = "127.0.0.1";
Chord.port = args[0];
Chord.key = computeKey("127.0.0.1",args[0]);

console.log("starting on port " + args[0]);
console.log("With key: " + Chord.key);

if(args.length >= 2) {
    var node = new remoteNode.Node("127.0.0.1", args[1], computeKey("127.0.0.1",args[1]));
    Chord.join(node)
} else {
    Chord.join();
};

handlers['chord'] = Chord;
//handlers['chord'] = new chord.Chord();


server.start(router.route, handlers, args[0]);
