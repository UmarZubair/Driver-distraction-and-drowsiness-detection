var socket = io.connect('http://localhost:3000');
var x;
var opt;
document.getElementById("browserinput").onchange = function () { myFunction() };
function myFunction() {
    x = document.getElementById("browserinput");
    opt = $('option[value="' + x.value + '"]');

}
var name = document.getElementById('browserinput'),
    message = document.getElementById('message'),
    message1 = document.getElementById('message1'),
    btn = document.getElementById('sendBtn'),
    btn2 = document.getElementById('sendMsg'),
    output = document.getElementById('messages'),
    spanName = document.getElementById('welcome'),
    ul = document.getElementById('msgs-list'),
    spanId = document.getElementById('welcomeId');
var d = new Date();
var mon = parseInt(d.getMonth()) + 1;
var date = d.getFullYear() + "/" + mon + "/" + d.getDate();
var time = d.getHours() + ":" + d.getMinutes();
var update_time = d.getTime();

//Send message from create new message model
btn.addEventListener('click', function () {
    socket.emit('chat', {
        senderID: spanId.innerHTML,
        senderName: spanName.innerHTML,
        senderDP: '',
        rID: opt.attr('id'),
        rName: x.value,
        message: message.value,
        date: d,
        updateTime: update_time,
        status: "unread",
    });

    message.value = '';
    x.value = '';
});

socket.on('chat', function (data, msg) {
    $("#msgs-list li").map(function () {     
        if(this.id === data.driverId){
            $('#' + this.id).remove();
        }
    })
    var li = document.createElement("li");
    li.setAttribute("id", data.driverId);
    li.classList.add("contact");
    var divNode = document.createElement("div");
    var divNode2 = document.createElement("div");
    var imgNode = document.createElement("img");
    var pNode = document.createElement("p");
    var pNode2 = document.createElement("p");
    divNode.classList.add("wrap");
    divNode2.classList.add("meta");
    imgNode.setAttribute("src", data.driverDP);
    pNode.classList.add("name");
    pNode2.classList.add("preview");
    var textnode1 = document.createTextNode(data.driverName);
    pNode.appendChild(textnode1);
    var textnode2 = document.createTextNode("You: " + msg.message_body);
    pNode2.appendChild(textnode2);
    divNode2.appendChild(pNode);
    divNode2.appendChild(pNode2);
    divNode.appendChild(imgNode);
    divNode.appendChild(divNode2);
    li.appendChild(divNode);
    ul.prepend(li);

    $("#msg-content ul").map(function () {   
        if(this.id === "cht-"+data.driverId){
            var li3 = document.createElement("li");
            var imgNode3 = document.createElement("img");
            var pNode3 = document.createElement("p");
            li3.classList.add("replies");
            imgNode3.setAttribute("src", msg.senderDP);
            var textnode1 = document.createTextNode(msg.message_body);
            pNode3.appendChild(textnode1);
            li3.appendChild(imgNode3);
            li3.appendChild(pNode3);
            this.appendChild(li3);
            $(".messages").animate({ scrollTop: $("#msg-content ul").height() }, "fast");
        }
    })
});


//Send message from within chat
btn2.addEventListener('click', function () {
    socket.emit('chat', {
        senderID: spanId.innerHTML,
        senderName: spanName.innerHTML,
        rID: document.getElementById("IdToSend").innerText,
        rName: document.getElementById("receiverName").innerText,
        message: message1.value,
        date: d,
        updateTime: update_time,
        status: "unread",
    });
    message1.value= "";

});

$('.msgs-list').on('click', 'li', function () {
    $('#no-content').hide();
    $('#has-content').show();
    $('.msgs-list li').removeClass('active');
    $(this).addClass('active');
    
    socket.emit('messageArea', {
        driverID: this.id
    });
    var textnode = document.createTextNode(this.id);
    $("#IdToSend").empty();
    document.getElementById("IdToSend").appendChild(textnode);
    document.getElementById("message1").value = "";
});

socket.on('messageArea', function (data) {
    var textnode1 = document.createTextNode(data.driverName);
    $("#receiverName").empty();
    document.getElementById("receiverName").appendChild(textnode1);
    document.getElementById("receiverPic").setAttribute("src", "../"+data.driverDP);

    $("#msg-content ul").map(function () {     
        if(this.id === "cht-"+data.driverId){
            $('#msg-content ul').hide();
            $('#' + this.id).show();
        }
    })
    $(".messages").animate({ scrollTop: $("#msg-content ul").height() }, "fast");
}); 

socket.on('myChat', function (msg, driver, manager) {
    $("#msgs-list li").map(function () {     
        if(this.id === driver._id){
            $('#' + this.id).remove();
        }
    })
    var li = document.createElement("li");
    li.setAttribute("id", driver._id);
    li.classList.add("contact");
    var divNode = document.createElement("div");
    var divNode2 = document.createElement("div");
    var imgNode = document.createElement("img");
    var pNode = document.createElement("p");
    var pNode2 = document.createElement("p");
    divNode.classList.add("wrap");
    divNode2.classList.add("meta");
    imgNode.setAttribute("src", driver.profilePicture.path);
    pNode.classList.add("name");
    pNode2.classList.add("preview");
    var textnode1 = document.createTextNode(driver.firstName + ' '  + driver.lastName);
    pNode.appendChild(textnode1);
    var textnode2 = document.createTextNode(msg.message_body);
    pNode2.appendChild(textnode2);
    divNode2.appendChild(pNode);
    divNode2.appendChild(pNode2);
    divNode.appendChild(imgNode);
    divNode.appendChild(divNode2);
    li.appendChild(divNode);
    ul.prepend(li);
    
    $("#msg-content ul").map(function () {   
        if(this.id === "cht-"+driver._id){
            var li3 = document.createElement("li");
            var imgNode3 = document.createElement("img");
            var pNode3 = document.createElement("p");
            li3.classList.add("sent");
            imgNode3.setAttribute("src", msg.senderDP);
            var textnode1 = document.createTextNode(msg.message_body);
            pNode3.appendChild(textnode1);
            li3.appendChild(imgNode3);
            li3.appendChild(pNode3);
            this.appendChild(li3);
            $(".messages").animate({ scrollTop: $("#msg-content ul").height() }, "fast");
        }
    })
});

