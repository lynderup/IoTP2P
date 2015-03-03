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
        url : "/chord/get_key",
        type : "GET",
        ContentType : "application/json"
    }).success(function(data){
        updateData(data.data);
    }).error(function(data){});

    function updateData(k){
        // findPredesessor.attr("href", node.predesessorLink);
        // findSuccessor.attr("href", node.sucessorLink);
        console.log(parseInt(k));
        key = parseInt(k);
        nodeId.text(k);
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

    registerApp.on("click", function() {
        $.ajax({
	    url : "/chord/register_app?url=" + appUrl.val(),
	    type : "GET",
	    ContentType : "application/json"
        }).success(function(data){
            
        }).error(function(data){});
    });

    function updateApps() {
        $.ajax({
            url : "/chord/get_apps",
            type : "GET",
            ContentType : "application/json"
        }).success(function(appList){
            apps.empty();
            var appsList = appList.data;
            for (var i = 0; i < appsList.length; i++) {
                var app = appsList[i];
                var $app = $("<div />");
                var $appName = $("<b />",{
                    html : app.name
                });
                $app.append($appName);
                var $appContent = $("<div />",{
                    html : app.content
                });
                $app.append($appContent);
                apps.append($app);
            }
        }).error(function(data){});
        

        setTimeout(updateApps, 1000);
    };
    updateApps();

    function updateFingerTable() {
        $.ajax({
            url : "/chord/get_fingers",
            type : "GET",
            ContentType : "application/json"
        }).success(function(data){
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
                console.log(key);
                var $fingerKey = $("<td />", {
                    html: (Math.pow(2, i) + key) % Math.pow(2, fingers.length)
                });
                $row.append($fingerKey);

                if(finger) {
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
        }).error(function(data){});

        setTimeout(updateFingerTable, 1000);
    };
    updateFingerTable();
}
