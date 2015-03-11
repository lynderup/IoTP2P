function init() {
  var findPredesessor = $("#findPredesessor");
  var findSuccessor = $("#findSuccessor");
  var findNode = $("#findNode");
  var inputId = $("#inputId");
  var nodeId = $("#nodeId");
  var fingerTable = $("#fingerTable tbody");

  var registerApp = $("#registerApp");
  var appUrl = $("#appUrl");
  var apps = $("#apps");

  var key = 0;

  $.ajax({
    url: "/chord/get_key",
    type: "GET",
    ContentType: "application/json"
  }).success(function(data) {
    updateData(data.data);
  }).error(function(data) {});

  function updateData(k) {
    // findPredesessor.attr("href", node.predesessorLink);
    // findSuccessor.attr("href", node.sucessorLink);
    //console.log(parseInt(k));
    key = parseInt(k);
    nodeId.text(k);
  }

  findNode.on("click", function() {
    if (inputId.val() != "") {
      $.ajax({
        url: "/chord/find_successor?id=" + inputId.val(),
        type: "GET",
        ContentType: "application/json"
      }).success(function(data) {
        //console.log(data.data.ip +":" +data.data.port + "/" + "index.html");
        window.location = "http://" + data.data.ip + ":" + data.data.port +
          "/" + "index.html";
      }).error(function(data) {});
    }
  });

  findPredesessor.on("click", function() {
    $.ajax({
      url: "/chord/get_predecessor",
      type: "GET",
      ContentType: "application/json"
    }).success(function(data) {
      //console.log(data.data.ip +":" +data.data.port + "/" + "index.html");
      window.location = "http://" + data.data.ip + ":" + data.data.port +
        "/" + "index.html";
    }).error(function(data) {});
  });

  findSuccessor.on("click", function() {
    $.ajax({
      url: "/chord/get_successor",
      type: "GET",
      ContentType: "application/json"
    }).success(function(data) {
      //console.log(data.data.ip +":" +data.data.port + "/" + "index.html");
      window.location = "http://" + data.data.ip + ":" + data.data.port +
        "/" + "index.html";
    }).error(function(data) {});
  });

  registerApp.on("click", function() {
    $.ajax({
      url: "/chord/register_app?url=" + appUrl.val(),
      type: "GET",
      ContentType: "application/json"
    }).success(function(data) {

    }).error(function(data) {});
  });

  function updateApps() {
    $.ajax({
      url: "/chord/get_apps",
      type: "GET",
      ContentType: "application/json"
    }).success(function(appList) {
      apps.empty();
      var appsList = appList.data;
      for (var i = 0; i < appsList.length; i++) {
        var app = appsList[i];
        var $app = $("<div />");
        var $appName = $("<b />", {
          html: app.name
        });
        $app.append($appName);
        //  console.log(app.data);
        var $appContent = $("<div />", {
          html: app.data
        });
        //$app.append($appContent);
        apps.append($app);

        updateDiagram(app.data);
      }
    }).error(function(data) {});


    setTimeout(updateApps, 5000);
  };
  updateApps();

  function updateFingerTable() {
    $.ajax({
      url: "/chord/get_fingers",
      type: "GET",
      ContentType: "application/json"
    }).success(function(data) {
      fingerTable.empty();
      var fingers = data.data;
      var i, $rowData;

      for (i = 0; i < fingers.length; i++) {
        var finger = fingers[i];
        var $row = $("<tr />");
        var $rowContent = $("<td />", {
          html: i
        });
        $row.append($rowContent);
        //console.log(key);
        var $fingerKey = $("<td />", {
          html: (Math.pow(2, i) + key) % Math.pow(2, fingers.length)
        });
        $row.append($fingerKey);

        if (finger) {
          $rowData = $("<td />", {
            html: finger.key
          });
        } else {
          $rowData = $("<td />", {
            html: "null"
          });
        }
        $row.append($rowData);
        fingerTable.append($row);
      }
    }).error(function(data) {});

    setTimeout(updateFingerTable, 1000);
  };
  updateFingerTable();

  function updateDiagram(foos) {
    $("#Diagram").empty();
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x).tickFormat(function(d) {
        return GetTime(d);
      })
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line().x(function(d) {

      return x(d.time);
    })
    line.y(function(d) {

      return y(d.temperature);
    });

    var svg = d3.select("#Diagram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top +
        ")");



    x.domain(d3.extent(foos, function(d) {
      return d.time;
    }));

    y.domain(d3.extent(foos, function(d) {
      return d.temperature;
    }));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "xtext")
      .attr("x", width + 20)
      .attr("y", -20)
      .attr("text-anchor", "end")
      .text("Time");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temprature");

    svg.append("path")
      .datum(foos)
      .attr("class", "line")
      .attr("d", line);
  }

  function GetTime(timestamp) {

    var date = new Date(timestamp);
    // hours part from the timestamp
    var hours = date.getHours();
    // minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(minutes.length - 2) +
      ':' +
      seconds.substr(seconds.length - 2);
    return formattedTime;
  }

}
