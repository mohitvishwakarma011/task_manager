const express = require("express");
const session = require('express-session');
const dbCoannection  = require('./config/db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 

const app = express();
const PORT = process.env.PORT||3000;

//DB Connection
dbCoannection();

//Models
const User = require('./models/task');
const User = require('./models/user');

//Express Middleware
app.set('view-engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({ secret: 'thisIsMySecret', resave: false, saveUninitialized: false }));

//Passport Config
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
//before login Home Route
app.get('/',require('./routes/users'));

app.use('/users',require('./routes/users'));

app.listen(3000,()=>{
    console.log("server is running on Port: 3000");
})