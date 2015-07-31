var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//añadir semilla 'quiz 2015' para cifrar cookie
app.use(cookieParser('Quiz 2015'));
app.use(session());

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  //guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  //hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});


// Controlamos que si está logeado no pase más de 120 segundos si hacer una peticion
app.use(function(req,res,next) {
  //si no está logeado se sigue tal cual
  if (!req.session.user) {
    console.log('sin usuario');
    next();
    return;
  }

  var fechaActual = new Date().getTime(); 

  //si no existe var ultimo acceso, la creamos y empezamos a tener en cuenta el tiempo
  if (!req.session.ultimoAcceso) {
    req.session.ultimoAcceso = new Date().getTime();
  }

  //diferencia en segundos entre el ultimo acceso y el actual
  var result = (fechaActual - req.session.ultimoAcceso)/1000;
  
  if (result <= 120) {
    //si menos de 120 segundos, actualizamos fecha y seguimos.
    req.session.ultimoAcceso = fechaActual;
  }
  else {
    // borramos variables de session que es lo que hace el logout
    delete req.session.user;
    delete req.session.ultimoAcceso;
  }
  next();
});


app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors:[]
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors:[]
  });
});


module.exports = app;
