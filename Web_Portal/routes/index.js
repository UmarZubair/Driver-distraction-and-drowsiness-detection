var express = require('express');
var router = express.Router();
var Driver = require('../db/driver');
var Manager = require('../db/manager');
var fs = require('fs');
const path = require('path');
var Message = require('../db/message');
var Ride = require('../db/ride');
var Notification = require('../db/notification');

global.onRide = 0;

var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  }
  else {
    res.redirect('/')
  }
}
// **************************************************************Portal Routes*****************************************************************//

router.get('/', function (req, res, next) {
  res.render('index2');
});

router.get('/dashboard', loggedin, function (req, res, next) {
 
  Message.find({}).sort({ updateTime: -1 }).exec(function (err, messages) {
    if (err) throw err;
    else {
      Message.find({ mmessage_status: 'unread' }).exec(function (err, new_messages) {
        if (err) throw err;
        else {
          var count = new_messages.length;
          Driver.find().exec(function (err, drivers) {
            if (err) throw err;
            else {
              var no_of_drivers = drivers.length;
              var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              var today = new Date();
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(months[today.getMonth()]);
              var yyyy = today.getFullYear();
              var date = mm + ' ' + dd + ', ' + yyyy;
              Ride.find({ride_status: "ended"}).sort({ _id: -1}).exec(function (err, rides) {
                if (err) throw err;
                else {
                  var ridesCount = 0;
                  rides.forEach(ride => {
                    if(ride.ride_status === "ongoing"){
                      ridesCount = ridesCount + 1;
                    }
                  });
                  Notification.find().sort({notification_date: -1, notification_time: -1}).exec(function(err, notifications) {
                    if (err) throw err;
                    else {
                      Notification.find({ notification_status: 'unread' }).exec(function (err, new_notifications) {
                        if (err) throw err;
                        else {
                          var countNotify = new_notifications.length;
                          res.render('dashboard', { messages, count, no_of_drivers, rides, notifications, countNotify, ridesCount });
                        }
                      });
                    }
                  });
                }
              })
            }
          })
        }
      })
    }
  })

});

router.get('/updateProfile', loggedin, function (req, res, next) {
  Manager.findOne({ _id: ManagerID }).exec(function (err, manager) {
    if (err) throw err;
    console.log(manager);
    Message.find({}).sort({ updateTime: -1 }).exec(function (err, messages) {
      if (err) throw err;
      else {

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
                    res.render('updateProfile', { manager, messages, count, notifications, countNotify });
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

router.post('/updateProfile', loggedin, function (req, res) {
  var body = req.body;
  var name = body.name.split(" ");
  var f = name[0];
  var l = name[1];
  var a = new Manager();
  Manager.findByIdAndUpdate(body.id,
    { firstName: f, lastName: l, cnic: body.cnic, email: body.email, phoneNumber: body.phone, password: body.pwd, hashedPassword: a.hashPassword(body.pwd), company_address: body.lp, company_name: body.ln }).exec(
      function (err, result) {
        if (err) throw err;
        else {
          ManagerName = f + " " + l;
          console.log(ManagerName);
          res.redirect('updateProfile');
        }
      });
});


router.get('/messenger', loggedin, function (req, res, next) {

  var receiverid = "";
  var dp = "";
  var name = "";
  Driver.find({ managerId: ManagerID }).exec(function (err, drivers) {
    if (err) throw err;
    else {
      Message.find({}).sort({ updateTime: -1 }).exec(function (err, messages) {
        if (err) throw err;
        else {
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
                      res.render('messenger', { drivers, messages, receiverid, dp, name, count, notifications, countNotify });
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

router.get('/messenger/id', loggedin, function (req, res, next) {
  var receiverid = req.query.id;
  var dp = "";
  var name = "";
  Driver.find({ managerId: ManagerID }).exec(function (err, drivers) {
    if (err) throw err;
    else {
      Message.find({}).sort({ updateTime: -1 }).exec(function (err, messages) {
        if (err) throw err;
        else {
          Message.findOne({ driverId: receiverid }).exec(function (err, specific_msg) {
            if (err) throw err;
            else {
              dp = specific_msg.driverDP;
              name = specific_msg.driverName;
              console.log(name);

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
                      res.render('messenger', { drivers, messages, receiverid, dp, name,  count, notifications, countNotify });
                    }
                  });
                }
              });
            }
          })
            }
          })
        }
      })
    }
  });

});




router.get('/header', loggedin, function (req, res, next) {
  Message.find({}).sort({ updateTime: -1 }).exec(function (err, messages) {
    if (err) throw err;
    else {
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
                  res.render('topBar', { messages, count, notifications, countNotify });
                }
              });
            }
          });
        }
      })
    }
  })
  
});

router.get('/logout', loggedin, function (req, res) {
  req.logout()
  res.redirect('/')
});

router.post('/checkagain', function (req, res) {

  emaill = req.body.email,
  password = req.body.password;
  Driver.findOne({ email: emaill }).exec(function (err, doc) {
    if (err) throw err;
    else {

      if (doc.password == password) {

        var usernamee = doc.email;
        var idd = doc._id;
        console.log(usernamee);
        res.json({ success: "1", message: "user logged in", email: usernamee, id: idd });


        //res.json({success: "1", message: "user logged in"});
        console.log('success');
      }

      else {
        res.json({ success: "0", message: "invalid email or password" });
        console.log('wrong password');
      }

    }

  });

});

router.get('/logs', loggedin, function (req, res) {
  var id = req.query.logID;
  Message.find({}).sort({ updateTime: -1 }).exec(function (err, messages) {
    if (err) throw err;
    else {
      Message.find({ mmessage_status: 'unread' }).exec(function (err, new_messages) {
        if (err) throw err;
        else {
          var count = new_messages.length;
          Driver.findOne({_id : id}).exec(function(err, driver) {
            if (err) throw err;
            Ride.find({driverId: id}).sort({ _id: -1 }).exec(function (err, rides) {
              if (err) throw err;
              else {
                Notification.find().sort({notification_date: -1, notification_time: -1}).exec(function(err, notifications) {
                  if (err) throw err;
                  else {
                    Notification.find({ notification_status: 'unread' }).exec(function (err, new_notifications) {
                      if (err) throw err;
                      else {
                        var countNotify = new_notifications.length;
                        res.render('logs', { messages, count, rides, driver, notifications, countNotify });
                      }
                    });
                  }
                });
              }
            })
          })
         }
      })
    }
  })
});

router.get('/ridelogs', loggedin, function (req, res) {
  var rid = req.query.logID;
  var did = req.query.dID;
  var notify = "";
  var notifyID = "";
  if(req.query.notification === "yes")
  {
    notify = req.query.notification;
    notifyID = req.query.notifyID;

  } 
 
  Message.find({}).sort({ updateTime: -1 }).exec(function (err, messages) {
    if (err) throw err;
    else {
      Message.find({ mmessage_status: 'unread' }).exec(function (err, new_messages) {
        if (err) throw err;
        else {
          var count = new_messages.length;
          Driver.findOne({_id : did}).exec(function(err, driver) {
            if (err) throw err;
            Ride.findOne({_id: rid}).exec(function (err, ride) {
              if (err) throw err;
              else {
                Notification.find().sort({notification_date: -1, notification_time: -1}).exec(function(err, notifications) {
                  if (err) throw err;
                  else {
                    Notification.find({ notification_status: 'unread' }).exec(function (err, new_notifications) {
                      if (err) throw err;
                      else {
                        var countNotify = new_notifications.length;
                        res.render('rideLogs', { messages, count, ride, driver, notifications, countNotify, notify, notifyID});
                      }
                    });
                  }
                });
              }
            })
          })
         }
      })
    }
  })
});

// ************************************************App routes**************************************************************************//


router.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  })
})
router.get('/reset', (req, res) => {
  res.render('reset');
})

router.post('/getDriverInfo', (req, res) => {

  Driver.findOne({ _id: req.body.driverID}).exec(function (err, driver) {
    if (err) throw err;
    else {
      res.send(driver);  
    }
  });  
})

router.post('/getRideRating', (req, res) => {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(months[today.getMonth()]);
    var yyyy = today.getFullYear();
    var date = mm + ' ' + dd + ', ' + yyyy;
    var data = req.body;
  Ride.findOne({ driverId: data.driverID, ride_date: date, start_time: data.startTime}).exec(function (err, ride) {
    if (err) throw err;
    else {
      res.send(ride);  
    }
  });  
})

router.post('/getRides', (req, res) => {
    var data = req.body;
  Ride.find({ driverId: data.driverID}).sort({ _id: -1 }).exec(function (err, rides) {
    if (err) throw err;
    else {
      res.send(rides);  
    }
  });  
})


router.post('/messages', (req, res) => {
  var message = new Message();
  message.message = req.body.message;
  message.name = req.body.browserinput;

  message.save((err) => {
    if (err) throw err;
    io.emit('message', req.body);
    console.log(JSON.stringify(message));
    res.sendStatus(200);
  })
})

router.post('/add/ride', (req, res) => {
  var body = req.body; 
  global.onRide = global.onRide + 1;
  Driver.findOne({ _id: body.driverID}).exec(function (err, driver) {
    if (err) throw err;
    else { 
      var ride = new Ride();
  var name='';
  var dp = "";
  ride.driverId = body.driverID;
  name =  driver.firstName + ' '  + driver.lastName;
  dp = driver.profilePicture.path;
  ride.driverName = name;
  ride.driverDP = dp;
  ride.ride_date = body.rideDate;
  ride.start_time = body.startTime;
  ride.start_location = body.startLoc;
  ride.ride_status = 'ongoing';  
  ride.authorized = body.authName; 
  ride.rate_distraction = body.rateDistract;
  ride.rate_drowsy = body.rateDrowsy;
  
  ride.save((err) => {
    if (err) throw err;
    else{
      res.send({status: 1, message: "success"});
     
    }})
    }
  });
  
 
})

/* router.post('/add/evidence', (req, res) => {
  
 
  
}) */

router.post('/end/ride', (req, res) => {
  var body = req.body;
  global.onRide = global.onRide - 1;
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(months[today.getMonth()]);
  var yyyy = today.getFullYear();
  var date = mm + ' ' + dd + ', ' + yyyy;
  driverID = body.driverID;
  end_time = body.endTime;
  end_location = body.endLoc;

  distance = body.distance;
  duration = body.duration;
  var countDrowsy = 0;
  var countDistract = 0;
  Ride.findOne({ driverId: driverID, ride_date: date, start_time: body.startTime}).exec(
    function (err, result) {
      if (err) throw err;
      else {   
          result.distractions.forEach(dist => {
            if(dist.distraction_type === "Drowsy") {
            countDrowsy = countDrowsy + dist.count;
            }
          });

          result.distractions.forEach(dist => {
          if(dist.distraction_type === "Distract") {
            countDistract = countDistract + dist.count;
          }
        });

        var rateDrowsy = (10-(((countDrowsy)/duration)*100)).toFixed(2);
        if(rateDrowsy < 0){
          rateDrowsy = 0;
        }
        var rateDistract = (10-(((countDistract)/duration)*100)).toFixed(2);
        if(rateDistract < 0){
          rateDistract = 0;
        }
        console.log(countDrowsy + " / " + countDistract);
        console.log(rateDrowsy + " / " + rateDistract);
      
        Ride.findOneAndUpdate({ driverId: driverID, ride_date: date, start_time: body.startTime},
          { $set: { authorized: body.authName, rate_distraction: rateDistract, rate_drowsy: rateDrowsy, ride_status: 'ended', end_time: end_time, end_location: end_location, distance_covered: distance, ride_duration: duration} }).exec(
            function (err, result) {
              if (err) throw err;
              else {   
                  res.send({status: 1, message: "success"});      
              }
            }
          );
      }
    }
  );
 
})

router.post('/getUnreadCount', function (req, res) {
  var driver = req.body;
  console.log(driver.firstName);
  Message.findOne({ driverId: driver._id, dmessage_status: 'unread' }).exec(function (err, new_messages) {
    if (err) throw err;
    else {
      if(new_messages){
        res.send({ status: 'unread'});
        console.log(new_messages);
      }
      else{
        res.send({status: 'read'});
        console.log(new_messages);

      }
      
    }
  })
  
});
router.post('/setReadStatus', function (req, res) {
  var driver = req.body;
  console.log(driver.firstName);
  Message.findOneAndUpdate({ driverId: driver._id, dmessage_status: 'unread' }
  ,{ $set: { dmessage_status: 'read' } }).exec(function (err, new_messages) {
    if (err) throw err;
    else {
      if(new_messages){
        res.send({ status: 'done'});
       // console.log(new_messages);
      
      }
      else{
        res.send({status: 'not done'});
        //console.log(new_messages);

      }
      
    }
  })
  
});
router.post('/getManagerInfo', function (req, res, next) {
  var driver = req.body;
  console.log(driver.managerId);
  Manager.findOne({ _id: driver.managerId }).exec(function (err, manager) {
    if (err) {
      console.log('error');
    }
    else {
      res.send(manager);
    }

  });
});
router.post('/getChat', function (req, res, next) {
  var driver = req.body;
  console.log(driver._id);
  Message.findOne({ driverId: driver._id }).exec(function (err, message) {
    if (err) throw err;
    else {
      if (!message) {
        console.log("empty chat")
        res.send({ message: "Empty Chat" });
      }
      else {
        // console.log(message.driverName);
        res.send(message);
      }
    }
  })
});

router.get('/getDrivers', loggedin, function (req, res, next) {
  Driver.find({ managerId: ManagerID }).exec(function (err, drivers) {
    if (err) throw err;
    else {

      res.render('check', { drivers }
      );

    }
  });
});
router.get('/api/login/error', function (req, res) {
  res.send('Invalid username or password');
});
router.get('/api/login/success', function (req, res) {
  res.send(req.user);
});


module.exports = router;
