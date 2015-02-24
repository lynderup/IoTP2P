var secret = process.argv.slice(2,3)[0];
var ponyMode = secret === "ponies";
var ponyString = "____________________________________▄▄████████▄▄\n";
ponyString += "______________________________▄█▓▓▓▓▓▓▓▓▓▓▓▓█▄\n";
ponyString += "_____________________________█▓▓███▓▓▓▓▓▓▓▓▓█▓█____________▄▄▄▄▄\n";
ponyString += "____________________________▐███▓▓▓██▓▓▓▓▓▓▓█▓▓█_______▄██▓▓▓▓▓█▄\n";
ponyString += "_____________________▄▄▄____█▓▓▓▓▓▓▓█▓▓▓▓▓▓▓█▓▓█___▄█▓▓▓▓▓▓▓▓▓▓▓█▄\n";
ponyString += "___________________█▓▓▓▓██▄█▓▓▓▓▓▓▓█▓▓▓▓▓▓█▓▓▓█_▄█▓░░░▓▓▓▓▓▓▓▓▓▓█▄\n";
ponyString += "______▄▄███████████▓▓▓▓▓██▓▓▓▓▓▓▓█▓▓▓▓▓█▓▓▓▓██▓░░░░░░▓▓▓▓▓▓▓▓▓█▄\n";
ponyString += "___▄██▓▓▓▓▓▓▓▓▓█▓▓███▓▓▓▓▓▓▓▓▓▓█▓▓▓▓▓█▓▓▓▓▓▓▓░░░░░░░░▓▓▓▓▓▓▓▓▓█\n";
ponyString += "__██▓▓▓▓▓▓▓▓▓▓▓▓█▓▓▓█▓▓▓▓▓▓▓▓▓█▓▓▓▓▓▓▓██▓▓▓▓░░░░░░░░░▓▓▓▓▓▓▓▓█▓█\n";
ponyString += "_██▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▓█▓▓▓▓▓▓▓▓▓▓███▓▓▓▓▓█▓▓▓░░░░░░░░░░▓▓▓▓▓▓▓█▓▓█\n";
ponyString += "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▓▓▓█▓▓▓░░░░░░░▓░░░▓▓▓▓▓█▓▓▓▓█\n";
ponyString += "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓███████░░░░░░░▓░░░▓▓▓██▓▓▓▓▓█▌\n";
ponyString += "██▓▓▓▓▓▓▓▓▓▓▓▓████▀▀▀▀██▓▓▓▓▓▓▓▓███░░░░░░░░░░░░░░▓░░░▓▓▓▓█▓▓▓▓▓▓█\n";
ponyString += "▐█▓▓▓▓▓▓▓▓▓▓██__________▓██▓▓▓▓▓▓█░░░░░░░░░░░░░░░░░▓░░░▓▓▓▓█▓▓▓▓▓▓█\n";
ponyString += "_▐█▓▓▓▓▓▓▓▓██__________▓▓░░░█▓▓▓█░░░░░░░░░░░░░░░░░░▓████████▓▓▓▓▓▓█\n";
ponyString += "___█▓▓▓▓▓▓▓█__________▓▓░░░░░░███░░░░░▄▄▄▄░░░░▐░░░███▓▓▓▓▓▓▓▓▓████▓█\n";
ponyString += "____█▓▓▓▓▓▓█_________▓▓░░░░░░░░█░░░░▄▀_____▀█▄░▄▌░█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▄\n";
ponyString += "___█_█▓▓▓▓▓█________▓▓░░░░░░░░░░░░▄▀__________▀█░░█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▄\n";
ponyString += "__█▓█_█▓▓▓▓█_______▓▓░░░░░░░░░░░█▓▓▓▓▓▓_______█▄█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓█\n";
ponyString += "__▐█▓███▓▓▓█______▓▓░░░░░░░░░░░█▓▓██▌___▓_____█░█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓█\n";
ponyString += "___█▓▓▓▓▓▓▓▓█_____▓▓░░░░░░░░░░█▓████▌____▓____▐▄▄█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▓█\n";
ponyString += "____█▓▓▓▓▓▓▓█_____▓▓░░░░░█░░░░█▓█████▄___▓_____░░░█▓▓▓███▓▓▓▓▓▓▓▓▓▓█▓▓█\n";
ponyString += "______██▓▓▓▓█_____▐▄▓░░░░░█░░░▐▓█████▀▀█▓▓▓____░██████▓▓▓█▓▓████▓▓█▓▓▓█\n";
ponyString += "_________▀▀▀▀______█▄▀▀▀▀█▀░░░░▐▓█████▄▄██▓▓__███▓▓▓▓▓████▓▓▓▓█▓▓▓▓▓▓▓█\n";
ponyString += "_____________________▄▄__▓_▐█▌░░░░▐▓████████▓▓__██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▓▓▓▓▓▓█\n";
ponyString += "_______________________▓__▓▀█░░░░░░░▓███████▓▓_▐█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▓▓▓▓▓▓█\n";
ponyString += "________________________▓__▓▀░░░░░░░_▓██████▓▓__█▓▓▓▓▓▓▓▓█▓▓▓▓▓██▓▓▓▓▓▓▓█\n";
ponyString += "________________________▓▓░░░░░░░░░░_▓▓▓▓▓▓___▐█▓▓▓▓▓▓▓▓▓█████▓▓▓▓▓▓▓▓█\n";
ponyString += "_______________________▓░░░░▄░░░░░░░░░_________░░█▓▓▓▓▓▓▓▓▓▓▓█▓▓████████\n";
ponyString += "_______________________▓░░░▀░░▄▄░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓▓█▓▓▓██\n";
ponyString += "________________________▓▓▓▄▄█___█▀░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓█▓▓▓▓██\n";
ponyString += "_____________________________▀▄__█░░░░░░░░░░░░░▓▓▓██▓▓▓▓▓▓▓▓▓█▓▓▓▓▓█\n";
ponyString += "________________________________█▓▓░░░░░░░▓▓▓▓_______██▓▓▓▓▓▓▓█▓▓▓▓▓▓█\n";
ponyString += "_____________________________________▓▓▓▓▓▓▓_____________▄▄███████▓▓▓▓▓▓█\n";
ponyString += "_________________________________________________________▄█▓▓▓▓▓▓▓▓▓▓▓▓▓▓█\n";
ponyString += "_________________________________________________________█▓▓▓▓▓▓▓▓▓▓▓▓▓▓█\n";
ponyString += "________________________________________________________▐█▓▓▓▓▓██▀▀█████\n";
ponyString += "__________________________________________________________█▓▓▓▓▓▓█▄\n";
ponyString += "____________________________________________________________▀▀█▓▓▓▓███▀\n";
ponyString += "________________________________________________________________▀▀▀▀\n";

// Our imports
var server = require('./node/server');
var router = require('./node/router');
var chord = require('./node/chord2');
//var remoteNode = require('./RemoteNode');
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

var ip = "127.0.0.1";

// ncurses
var nc = require('ncurses');
var widgets = require('ncurses/lib/widgets');

// The server setups
var activeNodes = [];
var servers = [];
var serverNames = [];
var basePort = 49152;

var startServers = function(count) {
  count = count || 1;

  for (var i = 0; i<count; i++) {
    var localPort = basePort+i;
    var key = computeKey(ip, localPort);
    var chordNode = new chord.Chord(ip, localPort, key, m, k);

    var handlers = {};

    if (i === 0) {
      chordNode.join();
    } else {
      var remotePort = servers[0].address().port;
      var remoteNode = new remoteNode.Node("127.0.0.1",
                                           remotePort,
                                           computeKey("127.0.0.1", remotePort));
      chordNode.join();
    }

    handlers['chord'] = new chord.ChordProxy(chordNode);

    var s = server.start(router.route, handlers, localPort);
    servers.push(s);
    activeNodes.push(chordNode);

    serverNames.push("Node at port + " + s.address().port);
  }

  listNodes(serverNames);
};

var stopServers = function(cb) {
  for (var i=0; i<servers.length; i++) {
    // one-shot closure, prevent i=servers.length
    servers[i].close(function(i) {
      return function() {
        activeNodes[i].close();
      };
    }(i));
  }

  servers = [];
  serverNames = [];
  listNodes(serverNames);
  cb();
};

var killServer = function(node) {
  var index = serverNames.indexOf(node);
  win.centertext(40, "Killing server: " + node);
  win.refresh();

  var server = servers[index];
  server.close(function() {
    servers.splice(index, 1);
    serverNames.splice(index, 1);
    activeNodes[index].close();
    activeNodes.splice(index, 1);

    if (ponyMode === true) {
      widgets.Viewer(ponyString, {
        title: "Pony :)",
        width: win.width,
        height: win.height,
        style: {
          colors: {
            bg: "blue"
          }
        }
      }, function() {
        listNodes(serverNames);
      });
    } else {
      listNodes(serverNames);
    }
  });
};


var showInfo = function(node) {
  var info = "flobber";

  var viewer = widgets.Viewer(info, {
    title: "Test",
    width: parseInt(win.width/2-1),
    height: win.height,
    pos: 'right',
    style: {
      colors: {
        bg: 'blue'
      }
    }
  }, function() {
    win.refresh();
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
    width: parseInt(win.width/2-1),
    pos: 'left',
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
      stopServers(function() {
        win.close();
      });
    } else if (selection === "Add nodes") {
      startServersInput();
    } else {
      win.centertext(30, "You've selected: " + selection);
      killServer(selection);
      win.refresh();
    }
  }, function(selection) {
    if (selection === "Quit"){
//    } else if (selection === "Add nodes") {
    } else {
      var index = serverNames.indexOf(selection);
      var node = activeNodes[index];
      showInfo(node);
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
