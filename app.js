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
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./config/database');

// view engine setup

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.set('views', path.join(__dirname, 'app/views'));
// app.use(express.static('./public'))
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./node_modules')));
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

app.get('/socket', function (req, res) {
  res.sendfile(__dirname + '/public/chat.html');
});
var test = null;
var logged = [];
io.sockets.on('connection', function(socket){
  test = socket;
  console.log('socket connected ...');
  require('./app/controller/socket')(io, socket);
  // logged = a.user;
  
});
app.post('/api/jadwal-mengajar', (req, res, next)=>{
    var val = {
          id_pengajar : req.body.id_pengajar,
          id_customer : req.body.id_customer,
          materi_mengajar : req.body.materi_mengajar,
          tanggal_mengajar : req.body.tanggal_mengajar,
          jam_mengajar : req.body.jam_mengajar
        };
      db.getConnection((err, con) =>{
        con.query('INSERT INTO jadwal_mengajar SET ?', val , (err, status) =>{
          con.query('select * from jadwal_mengajar where id_pengajar =  ? and id_customer = ? and materi_mengajar = ?', [val.id_pengajar, val.id_customer, val.materi_mengajar] , (err, status) =>{
          con.release();
            //io.sockets.emit('updatechat', socket.username, data.materi_mengajar+' @'+data.toUsername);
            console.log(status);
            console.log(logged[req.body.toUsername]);
            test.to(user[req.body.toUsername]).emit('private', status);

            res.json({status_code : 201, message : 'Berhasil menambahkan jadwal', data : status});
          });
        });
      });
  });
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

http.listen(port);
http.on('error', onError);
http.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function onListening() {
  var addr = http.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Server connected on port '+port);
}

