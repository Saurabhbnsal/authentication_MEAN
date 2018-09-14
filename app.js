var express = require('express');
var passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
var session = require('express-session');
const flash = require('connect-flash');
var expressValidator = require('express-validator');
const mongoose= require('mongoose');
const config = require('./config/database');
//App Init
var app = express();

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//parse application middleware
app.use(bodyParser.urlencoded({ extended: false}));

//parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express-session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,

}));

//Express-messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace= param.split('.'),
    root= namespace.shift('.'),
    formParam= root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//Passport config
require('./config/passport')(passport);
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next){
  res.locals.user = req.user || null;
  next();
});


//Home Route
app.get('/', function(req,res){
  res.render('index');
});

app.get('/register', (req,res) => {
  res.render('register');
});

//Route Files
let users = require('./routes/users');
app.use('/users', users);

//Server Connection
app.listen(3000, (err) => {
  if(err)
    throw err;
  console.log("Connected to port 3000");
});
