var mongoose = require('mongoose');
var schema = mongoose.Schema;
var driver = require('../db/driver');
var rideSchema = new schema({
    driverId: String,
    driverName: String,
    driverDP: String,
    ride_date: String, 
    start_time: String,
    end_time: String, 
    ride_duration: Number,
    distance_covered: String,
    start_location: String, 
    end_location: String, 
    ride_status: String,
    rate_distraction: Number,
    rate_drowsy: Number,
    authorized : String,
    distractions: [{
        distraction_time: String, 
        distraction_type: String,
        evidence_path: String,
        count: Number,
    }]
})


module.exports = mongoose.model('rides',rideSchema,'rides');