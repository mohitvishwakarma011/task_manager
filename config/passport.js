const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');


module.exports = function (passport){
    passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
        //match user
        User.findOne({email:email})
        .then((user)=>{
            if(!user)
            {
                return done(null,false,{
                    message:"That email is not registered"
                });
            }

            //match Password
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;

                if(isMatch)
                {
                    return done(null,user);
                }else{
                    return done(null,false,{
                        message:"Password Incorrect"
                    })
                }
            })
        }).catch((err)=>console.log(err));
    }))

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
          return cb(null, user.id);
        });
      });
    
      passport.deserializeUser(function (id, cb) {
        User.findById(id)
          .then((user) => cb(null, user)) 
          .catch((err) => cb(err, null));
      });
} 
