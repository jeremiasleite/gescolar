var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pug  = require('pug');
var mongoose = require('mongoose');
var session = require('express-session')
var flash = require('express-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true, 
    cookie: { maxAge: 3600000*8 }
}))

//var urlBd = 'mongodb://jeremiasleite:batista@ds011238.mlab.com:11238/gescola';
var urlBd = 'mongodb://127.0.0.1/gescola';
mongoose.connect(urlBd,function(err, res){
    if(err){
		console.log('não foi possivel conectar ..');
    }else{
        console.log('Conectado ...');
    }
});
app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.userSession = null;

app.use(function (req, res, next) {
	if (req.url.indexOf('/login') >= 0 || req.url.indexOf('/users/login') >= 0 || req.url.indexOf('/users/recuperarsenha') >= 0 || req.url.indexOf('/users/cadastrarnovasenha')>=0) {
		next();
	} else {		      
		if (req.session.user) {	
      app.locals.userSession = req.session.user;
			next();
		} else {
			res.redirect('/login');
		}
	}
});

app.use('/', index);
app.use('/users', users);
app.use('/alunos', require('./routes/aluno'));
app.use('/login', login);
app.use('/financeiro', require('./routes/financeiro'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
