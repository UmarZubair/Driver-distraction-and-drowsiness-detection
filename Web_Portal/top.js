var socket = io.connect('http://localhost:3000');

socket.on('Read Badge', function (count, dID) {
    var textnode = document.createTextNode(count);
    $("#badgeId").empty();
    document.getElementById("badgeId").appendChild(textnode);
    if(count > 0) {
        $("#spinnerDiv").show();
        $("#badgeDiv").show();
    } else {
        $("#spinnerDiv").hide();
        $("#badgeDiv").hide();
    }

    li = document.getElementById("not-" + dID);
    li.style.backgroundColor = "#fff";
});



socket.on('badge', function (count, msg, driver) {
    var textnode = document.createTextNode(count);
    $("#badgeId").empty();
    document.getElementById("badgeId").appendChild(textnode);
    if(count > 0) {
        $("#spinnerDiv").show();
        $("#badgeDiv").show();
    } else {
        $("#spinnerDiv").hide();
        $("#badgeDiv").hide();
    }

    $("#msgs-icon li").map(function () {     
        if(this.id === "not-"+driver._id){
            $('#' + this.id).remove();
        }
    });

    var li = document.createElement("li");
    li.setAttribute("id", "not-"+driver._id);
    li.style.backgroundColor = "rgb(236, 236, 236)";

    var a = document.createElement("a");
    a.setAttribute("href", "/messenger/id?id="+driver._id);

    var divNode = document.createElement("div");
    var divNode2 = document.createElement("div");
    var divNode3 = document.createElement("div");

    var imgNode = document.createElement("img");
    var hNode = document.createElement("h3");
    var pNode2 = document.createElement("p");

    divNode.classList.add("hd-message-sn");
    divNode2.classList.add("hd-message-img");
    divNode3.classList.add("hd-mg-ctn");

    imgNode.setAttribute("src", driver.profilePicture.path);
    var textnode1 = document.createTextNode(driver.firstName + ' '  + driver.lastName);
    hNode.appendChild(textnode1);
    var textnode2 = document.createTextNode(msg);
    pNode2.appendChild(textnode2);

    divNode2.appendChild(imgNode);
    divNode3.appendChild(hNode);
    divNode3.appendChild(pNode2);
    divNode.appendChild(divNode2);
    divNode.appendChild(divNode3);
    a.appendChild(divNode);
    li.appendChild(a);
    document.getElementById('msgs-icon').prepend(li);
}); 


socket.on('badgeNotify', function (count, data) {
    var textnode = document.createTextNode(count);
    $("#badgeId2").empty();
    document.getElementById("badgeId2").appendChild(textnode);
    if(count > 0) {
        $("#spinnerDiv2").show();
        $("#badgeDiv2").show();
    } else {
        $("#spinnerDiv2").hide();
        $("#badgeDiv2").hide();
    }

    var li = document.createElement("li");
    li.setAttribute("id", "notify-"+data.notify_id);
    li.style.backgroundColor = "rgb(236, 236, 236)";

    var a = document.createElement("a");
    a.setAttribute("target", "_blank");
    a.setAttribute("href", "/ridelogs?logID="+data.rideID+"&dID="+data.driverID + "&notification=yes" + "&notifyID=" + data.notify_id);

    var divNode = document.createElement("div");
    var divNode2 = document.createElement("div");
    var divNode3 = document.createElement("div");

    var imgNode = document.createElement("img");
    var hNode = document.createElement("h3");
    var pNode2 = document.createElement("p");

    divNode.classList.add("hd-message-sn");
    divNode2.classList.add("hd-message-img");
    divNode3.classList.add("hd-mg-ctn");

    imgNode.setAttribute("src", data.driverDP);
    var textnode1 = document.createTextNode(data.subject);
    hNode.appendChild(textnode1);
    var textnode2 = document.createTextNode(data.body);
    pNode2.appendChild(textnode2);

    divNode2.appendChild(imgNode);
    divNode3.appendChild(hNode);
    divNode3.appendChild(pNode2);
    divNode.appendChild(divNode2);
    divNode.appendChild(divNode3);
    a.appendChild(divNode);
    li.appendChild(a);
    document.getElementById('notify-list').prepend(li);
}); 

socket.on('ReadNotify', function (data) {
    
    var textnode = document.createTextNode(data.count);
    $("#badgeId2").empty();
    document.getElementById("badgeId2").appendChild(textnode);
    if(data.count > 0) {
        $("#spinnerDiv2").show();
        $("#badgeDiv2").show();
    } else {
        $("#spinnerDiv2").hide();
        $("#badgeDiv2").hide();
    }

    li = document.getElementById("notify-" + data.notifyID);
    li.style.backgroundColor = "#fff";
});