var createError = require('http-errors');
var express = require('express');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var db = require('./db');

const MySQLStore = require('express-mysql-session')(session);

var indexRouter = require('./routes/index');
var { router: authRouter } = require('./routes/auth');
var userRouter = require('./routes/user');

var app = express();

// view engine setup

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mySecretKey',
  resave: false ,
  saveUninitialized: false,
  store: new MySQLStore({} , db)
}));
app.use(passport.authenticate('session'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user || null;
  next();
})




app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Page Not Found')); // 🔹 Provide a custom message
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: "Error", 
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {} // Hide stack trace in production
  });
});

module.exports = app;
