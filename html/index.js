function init() {
    var findPredesessor = $("#findPredesessor");
    var findSuccessor = $("#findSuccessor");
    var findNode = $("#findNode");
    var inputId = $("#inputId");
    var nodeId = $("#nodeId");


    $.ajax({
        url : "/chord/get_key",
        type : "GET",
        ContentType : "application/json"
    }).success(function(data){
        updateData(data.data)
    }).error(function(data){})

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
	    }).error(function(data){})
        }
    });

    findPredesessor.on("click", function(){ 
        
        $.ajax({
	    url : "/chord/get_predecessor",
	    type : "GET",
	    ContentType : "application/json"
        }).success(function(data){
	    //console.log(data.data.ip +":" +data.data.port + "/" + "index.html");
	    window.location = "http://"+data.data.ip +":" +data.data.port + "/" + "index.html";
        }).error(function(data){})
    });

    findSuccessor.on("click", function(){ 
        
        $.ajax({
	    url : "/chord/get_successor",
	    type : "GET",
	    ContentType : "application/json"
        }).success(function(data){
	    //console.log(data.data.ip +":" +data.data.port + "/" + "index.html");
	    window.location = "http://"+data.data.ip +":" +data.data.port + "/" + "index.html";

        }).error(function(data){})
    });
}