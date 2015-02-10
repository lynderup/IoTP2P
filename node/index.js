var server = require('./server');
var router = require('./router');
//var chord = require('./chord');
var test = require('./test');

//var handlers['chord'] = chord;
var handlers = {};
handlers['test'] = test;

server.start(router.route, handlers);
