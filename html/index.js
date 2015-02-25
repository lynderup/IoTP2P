function init() {
    var findPredesessor = $("#findPredesessor");
    var findSuccessor = $("#findSuccessor");
    var findNode = $("#findNode");
    var inputId = $("#inputId");
    var nodeId = $("#nodeId");
    var fingerTable = $("#fingerTable");


    $.ajax({
        url : "/chord/get_key",
        type : "GET",
        ContentType : "application/json"
    }).success(function(data){
        updateData(data.data);
    }).error(function(data){});

    function updateData(key){
        // findPredesessor.attr("href", node.predesessorLink);
        // findSuccessor.attr("href", node.sucessorLink);
        nodeId.text(key);
    }

    findNode.on("click", function(){
        if(inputId.val() != ""){
	    $.ajax({
	        url : "/chord/find_successor?id="+inputId.val(),
	        type : "GET",
	        ContentType : "application/json"
	    }).success(function(data){
	        console.log(data.data.ip +":" +data.data.port + "/" + "index.html");
	        window.location = "http://"+data.data.ip +":" +data.data.port + "/" + "index.html";
	    }).error(function(data){});
        }
    });

    findPredesessor.on("click", function() {
        $.ajax({
	    url : "/chord/get_predecessor",
	    type : "GET",
	    ContentType : "application/json"
        }).success(function(data){
	    //console.log(data.data.ip +":" +data.data.port + "/" + "index.html");
	    window.location = "http://"+data.data.ip +":" +data.data.port + "/" + "index.html";
        }).error(function(data){});
    });

    findSuccessor.on("click", function() {
        $.ajax({
	    url : "/chord/get_successor",
	    type : "GET",
	    ContentType : "application/json"
        }).success(function(data){
	    //console.log(data.data.ip +":" +data.data.port + "/" + "index.html");
	    window.location = "http://"+data.data.ip +":" +data.data.port + "/" + "index.html";
        }).error(function(data){});
    });

    function updataFingerTable() {
        $.ajax({
            url : "/chord/get_fingers",
            type : "GET",
            ContentType : "application/json"
        }).success(function(data){
          fingerTable.empty();
          var fingers = data.data;
          var i;
          for (i = 0; i < fingers.length; i++) {
            var finger = fingers[i];
            var $row = $("<tr />");
            var $rowContent = $("<td />", {
              html: i
            });
            $row.append($rowContent);
            var $rowData;
            if(finger) {
              $rowData += $("<td />", {
                html: finger.key
              });

              var $extraRow = $("<tr />");
              $extraRow.append($("<td />", {
                html: "Hashed key"
              }));
              $extraRow.append($("<td />"), {
                html: finger.key
              });

              $row.append($rowData);
              fingerTable.append($row);
              fingerTable.append($extraRow);
            } else {
              $rowData += $("<td />", {
                html: "null"
              });

              $row.append($rowData);
              fingerTable.append($row);
            }
          }
        }).error(function(data){});

        setTimeout(updataFingerTable, 1000);
    };
    updataFingerTable();
}
