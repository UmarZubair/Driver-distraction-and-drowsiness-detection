var express = require('express');
var router = express.Router();
var Driver= require('../db/driver');
var Notification = require('../db/notification');
var Message= require('../db/message');
var fs = require('fs');
var crypto = require('crypto');
var multer = require('multer');
var multer1 = require('multer');
var path = require('path');
var mongoose = require('mongoose');
global.Jimp = require('jimp');
var loggedin = function(req,res,next)
{
  if(req.isAuthenticated()){
    next()
      }
      else{
        res.redirect('/')
      }
}

var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
     crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return callback(err)
      if(req.body.cnic!= null){
        callback(null, req.body.cnic + path.extname(file.originalname));}
      else{
        callback(null, req.query.pcnic + path.extname(file.originalname));
      }
    });
  }
});
var upload = multer({ storage : storage}).single('userPhoto');



router.post('/api',function(req,res){
  
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
    }
    
	console.log("File is uploaded");
  var body=req.body;
    var f =  body.fname;
    var l=  body.lname;
    var lp=  body.license;
    var ln =  body.lcnumber;
    var lc = body.lccity; 
    var ld = body.lcdate;
    Jimp.read(req.file.path, (err, lenna) => {
    if (err) throw err;
    lenna
    .resize(450, 450) // resize
    .quality(60) 
    .write(req.file.path); // save

    });
    var image_name =req.file.path.split("\\");
    console.log(image_name);
    
    Driver.findOne({cnic:body.cnic},function(err,doc){
        if(err) {
            res.status(500).send('Error Occurred')}
            else {
                if(doc){
                    res.status(500).send('Driver Already Exists')
                }
                else{
                    var record = new Driver()
                    record.managerId= ManagerID;
                    record.firstName= f;
                    record.lastName= l;
                    type= 'Driver';
                    record.dateOfBirth= body.dob;
                    record.cnic=body.cnic;
                    record.profilePicture.path =  image_name[1];
                    record.email=body.email;
                    record.phoneNumber=body.phone;
                    record.password= body.pwd;
                    record.hashedPassword= record.hashPassword(body.pwd);
                    record.address= body.address;
                    record.licenseProvider= lp;
                    record.licenseNumber=ln;
                    record.licenseCity=  lc;
                    record.licenseExpiryDate= ld;
                    record.save(function(err,driver){
                        if(err){
                          res.status(500).send('Error in DB')
                        } else{
                          res.redirect('/crud/list-of-drivers');
                          console.log('success');
                        }                      
                    })
                }
            }
        });
  

	});
   
});

router.delete('/delDriver', function(req, res) {
       var id = req.query.id;
       Driver.deleteOne({ _id: id }, function (err) {
       if (err) return handleError(err);
       else{
        Driver.find({managerId: ManagerID}).exec(function(err, drivers) {
       if (err) throw err;
       else{
       console.log(drivers);
       res.render('listDrivers', {drivers});
       }
    });
       }
      });  
      });


router.post('/updateDriver',loggedin, function(req, res) {
    var body=req.body;
    var name= body.name.split(" ");
    var f =  name[0];
    var l=  name[1];
    var a = new Driver();
    Driver.findByIdAndUpdate(body.id, 
    { firstName : f, lastName : l, dateOfBirth: body.dob, cnic : body.cnic, email: body.email, phoneNumber: body.phone, password: body.pwd, hashedPassword: a.hashPassword(body.pwd), address:body.address, licenseProvider:body.lp, licenseNumber: body.ln, licenseCity: body.lc, licenseExpiryDate: body.ld}).exec(
    function(err, result) {
        if (err) throw err;
        else{
         res.redirect('/crud/account?id='+result._id); }  
          });
    });
  
router.post('/updatePhoto',loggedin, function(req, res) {
    var id=req.query.pid;
    var pathName = req.query.pcnic;
    fs.unlink('./uploads/'+pathName, function () {console.log('write operation complete.');
    });

    upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
  	console.log("File is uploaded");
    Jimp.read(req.file.path, (err, lenna) => {
    if (err) throw err;
    lenna
    .resize(450, 450) // resize
    .quality(60) 
    .write(req.file.path); // save

});
    var image_name =req.file.path.split("\\");
    console.log(req.file.path);
    var imgName= image_name[1];
    console.log(imgName);
    Driver.findOneAndUpdate({_id: id}, 
    {$set:{profilePicture: {path: imgName}} }).exec(
    function(err, result) {
        if (err) throw err;
        else{
         res.redirect('/crud/account?id='+id); }  
          });
    });
    });

router.get('/add',loggedin, function(req, res) {
  Message.find({}).sort({updateTime:-1}).exec( function (err, messages){
    if (err) throw err;
    else{
      Message.find({ mmessage_status: 'unread' }).exec(function (err, new_messages) {
        if (err) throw err;
        else {
          var count = new_messages.length;
          Notification.find().sort({notification_date: -1, notification_time: -1}).exec(function(err, notifications) {
            if (err) throw err;
            else {
              Notification.find({ notification_status: 'unread' }).exec(function (err, new_notifications) {
                if (err) throw err;
                else {
                  var countNotify = new_notifications.length;
                  res.render('insertDriver', {  messages, count, notifications, countNotify });
                }
              });
            }
          });
        }
      })
    }
  })
    
});

router.get('/list-of-drivers', loggedin, function(req, res, next) {
    Driver.find({managerId: ManagerID}).exec(function(err, drivers) {
       if (err) throw err;
       else{
       console.log(drivers);
       Message.find({}).sort({updateTime:-1}).exec( function (err, messages){
        if (err) throw err;
        else{
          Message.find({ mmessage_status: 'unread' }).exec(function (err, new_messages) {
            if (err) throw err;
            else {
              var count = new_messages.length;
              Notification.find().sort({notification_date: -1, notification_time: -1}).exec(function(err, notifications) {
                if (err) throw err;
                else {
                  Notification.find({ notification_status: 'unread' }).exec(function (err, new_notifications) {
                    if (err) throw err;
                    else {
                      var countNotify = new_notifications.length;
                      res.render('listDrivers', { drivers, messages, count, notifications, countNotify });
                    }
                  });
                }
              });
            }
          })
        }
      })
     }
    });
});

router.get('/account', loggedin, function(req,res){
  var id = req.query.id;
        Driver.findOne({_id : id}).exec(function(err, driver) {
         if (err) throw err;
         console.log(driver);
         Message.find({}).sort({updateTime:-1}).exec( function (err, messages){
          if (err) throw err;
          else{
            Message.find({ mmessage_status: 'unread' }).exec(function (err, new_messages) {
              if (err) throw err;
              else {
                var count = new_messages.length;
                Notification.find().sort({notification_date: -1, notification_time: -1}).exec(function(err, notifications) {
                  if (err) throw err;
                  else {
                    Notification.find({ notification_status: 'unread' }).exec(function (err, new_notifications) {
                      if (err) throw err;
                      else {
                        var countNotify = new_notifications.length;
                        res.render('DriverAccount', { driver, messages, count, notifications, countNotify });
                      }
                    });
                  }
                });
              }
            })
          }
        })
          
        });
  
});
 
router.get('/profile/', loggedin, function(req, res) {
        var id = req.query.id;
        Driver.findOne({_id : id}).exec(function(err, driver) {
         if (err) throw err;
         console.log(driver);
         Message.find({}).sort({updateTime:-1}).exec( function (err, messages){
          if (err) throw err;
          else{
            res.render('driverProfile', {driver, messages});
          }
        })
      });
});

router.get('/:driverId', function(req,res,next) {
   
  Driver.findOne({_id :  req.params.driverId}).exec(function(err,driver) {
      if (err) return next(err);
      if (!driver) {
        res.status(404).send('No Record Found');
      }
      else{
      console.log(driver.profilePicture.path);
      var image_name = driver.profilePicture.path.split("\\");
      console.log(image_name);
      var fullpath= '../' + image_name[1];
      res.send(fullpath);
         
      }
  });
});




module.exports = router;