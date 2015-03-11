var https = require('https');


var Application = function(node) {

    var localNode = node;
    var dataSources = [];
    var updateDataTimer = null;
    var thisApp = this;

    this.addSource = function(source) {
        source.data = [];
        dataSources.push(source);
    };


    var updateData = function() {
        var visit = function(i) {
            if(i == dataSources.length) {
            } else {
                var dataSource = dataSources[i];
                if (dataSource) {
                    https.get(dataSource.contentUrl, function(res) {
                        var recievedData = "";
                        res.on('data', function (chunk) {
                            recievedData += chunk;
                        });
                        res.on('end', function() {
                            if(res.statusCode == 200) {
                                var data = JSON.parse(JSON.parse(recievedData).result);
                                data.time = Date.now();
                                console.log(data);
                                dataSource.data.push(data);
                                visit(i+1);
                            };
                        });
                    }).on('error', function(e) {});
                }
            }
        }
        visit(0);
        updateDataTimer = setTimeout(updateData, 1000);
    };
    updateData();
    
    this.close = function() {
        clearTimeout(updateDataTimer);
    };

    this.get_apps = function(callback) {
        callback(dataSources);
    };

    this.register_source = function(url) {
        https.get(url, function(res) {
           var recievedData = "";
            res.on('data', function (chunk) {
                recievedData += chunk;
            });
            res.on('end', function() {
                if(res.statusCode == 200) {
                    console.log(recievedData)
                    var data = JSON.parse(JSON.parse(recievedData).result);
                    var key = parseInt(data.key)
                    if(key) {
                        if (localNode.in_interval(key, localNode.predecessor.key, localNode.key)) {
                            thisApp.addSource(data);
                        } else {
                            localNode.find_successor(key, function(node, err) {
                                if (node) {
                                    node.addSource(data);
                                }
                            });
                        }
                    } else {
                        //logger.log("No app found on: " + url);
                    }
                }
            });
        }).on('error', function(e) {
            //logger.log("App not found");
        });
    };
    
};

exports.Application = Application