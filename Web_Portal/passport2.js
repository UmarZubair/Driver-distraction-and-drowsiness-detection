var localStrategy= require('passport-local').Strategy;
var User = require('./db/driver')
global.DriverName = ""; 
global.DriverID = "";
module.exports = function(passport2){
passport2.serializeUser(function(user,done)
{
done(null,user)
})
passport2.deserializeUser(function(user,done)
{
    done(null,user)

})

passport2.use(new localStrategy({usernameField: 'email'},function(username,password,done){
User.findOne({email:username},function(err,doc){
    if(err){done(err)}
    else{
        if(doc){
           var valid = doc.comparePassword(password,doc.password)
        if(valid){
            done(null,{
                email:doc.username,
                password:doc.password
            })
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
}))
}