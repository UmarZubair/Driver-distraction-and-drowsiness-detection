var mongoose = require('mongoose');
var schema = mongoose.Schema;
var manager= require('../db/manager');
var bcrypt = require('bcrypt-nodejs');


var driverSchema = new schema({
	    managerId: {type:  mongoose.Schema.Types.ObjectId, ref: 'manager'},
   	    firstName: String,
		lastName: String,
		type: String,
     	dateOfBirth: String,
    	cnic: String,
    	profilePicture: {
			path: String
		},
    	email: {type: String, required: true},
    	phoneNumber: String,
    	password: {type: String, required: true},
		hashedPassword: {type: String, required: true},
    	address: String,
    	licenseProvider: String,
        licenseNumber: String,
    	licenseCity: String,
    	licenseExpiryDate: String,
})
driverSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}
driverSchema.methods.comparePassword = function(hashedPassword,hash){
    return bcrypt.compareSync(hashedPassword,hash)
}

module.exports = mongoose.model('drivers',driverSchema,'drivers');