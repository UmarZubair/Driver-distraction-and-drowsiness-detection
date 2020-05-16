var mongoose = require('mongoose');
var schema = mongoose.Schema;
var manager = require('../db/manager');
var driver = require('../db/driver');

 var messageSchema = new schema({
    driverId: String,
    driverName: String,
    driverDP: String,
    updateTime: Number,
    dmessage_status: String,
    mmessage_status: String,
    chat: [{
        senderId: String,
        senderName: String,
        senderDP: String,
        receiverId: String,
        receiverName: String,
        receiverDP: String,  
        message_body: String,
        message_date: Date,
       
    }] 
}) 




module.exports = mongoose.model('messages', messageSchema, 'messages');