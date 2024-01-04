const express = require("express");
const session = require('express-session');
const dbCoannection  = require('./config/db');
const expressLayouts = require('express-ejs-layouts');
const passport = require("passport");
const flash = require('connect-flash');

//Passport config
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT||3000;

//DB Connection
dbCoannection();


//Express Middleware
app.use(expressLayouts);
app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));
app.use(session({ secret: 'thisIsMySecret', resave: false, saveUninitialized: false }));

//Passport Config
app.use(passport.initialize());
app.use(passport.session()); 

//flash
app.use(flash());

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
//ROUTES
//before login Home Route
app.use('/',require('./routes/welcome'));

app.use('/users',require('./routes/users')); 
app.use('/task',require('./routes/task'));

app.listen(PORT,()=>{
    console.log("server is running on Port:"+PORT);
}) 