var mongoose = require('mongoose');
var schema = mongoose.Schema;


var notificationSchema = new schema({
    notification_title: String, 
    notification_body: String,
    notification_type: String,
    notification_driverID: String,
    notification_driverDP: String,
    notification_rideID: String,
    notification_date: Date, 
    notification_time: String,
    notification_status: String,
})


module.exports = mongoose.model('notifications',notificationSchema,'notifications');