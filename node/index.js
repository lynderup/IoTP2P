var server = require('./server');
var router = require('./router');
//var chord = require('./chord');
var test = require('./test');

//var handlers['chord'] = chord;
var handlers = {};
handlers['test'] = test;
//handlers['chord'] = new chord.Chord();

server.start(router.route, handlers);
