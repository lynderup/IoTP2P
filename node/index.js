var server = require('./server');
var router = require('./router');
var chord = require('./chord');

var handlers['chord'] = chord;

server.start(router.route, handlers);
