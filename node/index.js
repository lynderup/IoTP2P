var server = require('./server');
var router = require('./router');
var chord = require('./chord2');
var test = require('./test');

var handlers = {};
handlers['test'] = test;
handlers['chord'] = chord;

server.start(router.route, handlers);
