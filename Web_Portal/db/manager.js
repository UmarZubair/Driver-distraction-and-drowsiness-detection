var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema;

var managerSchema = new schema({
   
    firstName: String,
    lastName: String,
    type: String,
    cnic: String,
   	email: {type: String, required: true},
    phoneNumber: String,
    password: {type: String, required: true},
    hashedPassword: {type: String, required: true},
    company_address: String,
    company_name: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    })
managerSchema.methods.hashPassword = function(hashedPassword){
    return bcrypt.hashSync(hashedPassword,bcrypt.genSaltSync(10))
}
managerSchema.methods.comparePassword = function(password,hash){
    return bcrypt.compareSync(password,hash)
}

module.exports = mongoose.model('managers',managerSchema,'managers');