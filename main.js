// Our imports
var server = require('./node/server');
var router = require('./node/router');
var test = require('./node/test');
var chord = require('./node/chord');
var chord2 = require('./node/chord');

// ncurses
var nc = require('ncurses');
var widgets = require('ncurses/lib/widgets');

// The server setups
var servers = [];
var serverNames = [];
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

    serverNames.push("Node at port + " + port);
  }

  listNodes(serverNames);
};

var stopServers = function() {
  for (var i=0; i<servers.length; i++) {
    servers[i].close();
  }

  servers = [];
};

var killServer = function(node) {
  var index = serverNames.indexOf(node);
  win.centertext(40, "Killing server: " + node);
  win.refresh();

  var server = servers[index];
  server.close(function() {
    servers.splice(index, 1);
    serverNames.splice(index, 1);
    listNodes(serverNames);
  });
};


// ncurses "UI"
var win = new nc.Window();

var listNodes = function(nodes) {
  var actualNodes = nodes.slice(0);
  actualNodes.push("Add nodes");
  actualNodes.push("Quit");

  var lb = widgets.ListBox(actualNodes, {
    title: 'Active nodes',
    height: win.height,
    width: win.width,
    style: {
      colors: {
        bg: 'blue',
        sel: {
          fg: 'red'
        }
      }
    }
  }, function(selection) {
    selection = selection || "nothing";

    if (selection === "Quit") {
      stopServers();
      win.close();
    } else if (selection === "Add nodes") {
      startServersInput();
    } else {
      win.centertext(30, "You've selected: " + selection);
      killServer(selection);
      win.refresh();
    }
  });

  win.refresh();
};

var startServersInput = function() {
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
};

win.setscrreg(1, win.height-3);
win.refresh();

listNodes(servers);

nc.showCursor = false;
