var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var index = require('./app/routes/index');
var passport = require('passport');
var mysql = require('mysql');
var session = require('express-session');
var flash = require('connect-flash');

var app = express();

// view engine setup


app.use(express.static('./public'));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

var conn = require('./config/database');
require('./config/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:'iloveyousomuch'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./app/routes/admin')(app,passport);
require('./app/routes/users')(app,passport);
app.use('/api',require('./app/routes/api/routes'));
app.use(index);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
