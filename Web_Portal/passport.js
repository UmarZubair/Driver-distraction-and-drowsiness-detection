var localStrategy= require('passport-local').Strategy;
var User = require('./db/manager');
var Driver = require('./db/driver')
global.ManagerName = ""; 
global.ManagerID = "";
global.DriverID= "";
global.DriverName="";

module.exports = function(passport){
   
passport.serializeUser(function(user,done)
{
done(null,user)
})
passport.deserializeUser(function(user,done)
{
    done(null,user)

}) 
/* passport.serializeUser(function(user, done) {
    var key = {
      id: user._id,
      type: user.type
    }
    done(null, key);
  })

  passport.deserializeUser(function(key, done) {
    // this could be more complex with a switch or if statements
    var Model = key.type === 'Manager' ? User : Driver; 
    Model.findOne({
      _id: key.id
    }, function(err, user) {
      done(err, user);
    }
  );
}) */

/*passport.serializeUser((obj, done) => {
    if (obj instanceof Driver) {
      done(null, { id: obj._id, type: 'Driver' });
    } else {
      done(null, { id: obj._id, type: 'Manager' });
    }
  });

  
  passport.deserializeUser((obj, done) => {
    if (obj.type === 'Manager') {
        User.findOne({_id:obj.id},function(err,doc){
            if(err){done(err)}
            else{
                if(doc){
                    done(null, doc);

                }
            }});
    } else {
        Driver.findOne({_id:obj.id},function(err,doc){
            if(err){done(err)}
            else{
                if(doc){
                    done(null, doc);

                }
            }});
    }
  });  */
 
passport.use('manager', new localStrategy({usernameField: 'email'},function(username,password,done){
User.findOne({email:username},function(err,doc){
    if(err){done(err)}
    else{
        if(doc){
           var valid = doc.comparePassword(password,doc.hashedPassword)
        if(valid){
            done(null,{
                email:doc.username,
                password:doc.password
            })
            ManagerName = doc.firstName + " " + doc.lastName;
            console.log(ManagerName);
            ManagerID = doc._id;
            console.log(ManagerID);
        }
        else{
            console.log('wrong password')
            done(null,false)
        }
        }
        else{
            console.log('wrong username')
            done(null,false)
        }
    }
})
}))

passport.use('driver', new localStrategy({usernameField: 'email'},function(username,password,done){
    Driver.findOne({email:username},function(err,doc){
        if(err){done(err)}
        else{
            if(doc){
               var valid = doc.comparePassword(password,doc.hashedPassword)
            if(valid){
                done(null,doc)
                DriverName = doc.firstName + " " + doc.lastName;
                console.log(DriverName);
                DriverID = doc._id;
                console.log(DriverID);
            }
            else{
                console.log('wrong password')
                done(null,false)
            }
            }
            else{
                console.log('wrong username')
                done(null,false)
            }
        }
    })
    }));
    
}

