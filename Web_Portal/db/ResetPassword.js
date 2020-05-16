var mongoose = require('mongoose');
var schema = mongoose.Schema;


 var resetSchema = new schema({
    userId: {type:  mongoose.Schema.Types.ObjectId, required: true},
    expire: Date,
    resetPasswordToken: String,
 
}) 




module.exports = mongoose.model('reset', resetSchema, 'reset');