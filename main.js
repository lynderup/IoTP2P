// Our imports
var server = require('./node/server');
var router = require('./node/router');
var test = require('./node/test');
var chord = require('./node/chord');

// ncurses
var nc = require('ncurses');
var widgets = require('ncurses/lib/widgets');

// The server setups
var servers = [];
var port = 49152;
var startServers = function(count) {
  count = count || 1;

  for (var i = 0; i<count; i++) {
    var handlers = [];
//    handlers['chord'] = new chord.Chord();
    handlers['test'] = test;

    port++;
    var s = server.start(router.route, handlers, port);
    servers.push(s);
    win.centertext(i, "Port: " + port);
    win.refresh();
  }
};

var stopServers = function() {
  for (var i=0; i<servers.length; i++) {
    servers[i].close();
  }

  servers = [];
};


// ncurses "UI"
var win = new nc.Window();

win.on('inputChar', function(c, i) {
  if (i === nc.keys.ESC || c === 'q')
    win.close();
  else if (c === 'n') {
    widgets.InputBox("How many servers?",
                    {
                      buttons: ['OK', "Cancel"],
                      pos: "Center",
                      style: {
                        colors: {
                          bg: "blue",
                          input: {
                            fg: "yellow",
                            bg: "black"
                          }
                        }
                      }
                    }, function(input) {
                      input = input || 1;
                      input = parseInt(input);

                      if (input > 0 && input < 100) {
                        win.centertext(0, "You entered: " + input);
                        startServers(input);
                      } else {
                        win.centertext(0, "Error, bad input: " + input);
                      }

                      win.refresh();
                    });
  }
});
win.hline(win.height-2, 0, win.width);
win.setscrreg(1, win.height-3);
win.refresh();

nc.showCursor = false;
