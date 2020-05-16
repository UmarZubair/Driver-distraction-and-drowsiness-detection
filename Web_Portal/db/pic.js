var mongoose = require('mongoose');
var schema = mongoose.Schema;
var manager= require('../db/manager');

var picSchema = new schema({
	    managerId: {type:  mongoose.Schema.Types.ObjectId, ref: 'manager'},
		img: {
			path: String
    	//data: Buffer,
		//contentType: String
		}  	
});

module.exports = mongoose.model('pics',picSchema,'pics');