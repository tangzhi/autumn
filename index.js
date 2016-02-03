var debug = require('debug')('autumn:index');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var errorhandler = require('errorhandler');

var web = require('./web');
var service = require('./service');

var app = express();

app.use(session({
  key: 'leaf.sid',
  secret: 'autumn-leaf',
  resave: true,
  saveUninitialized: true
}));

app.use(/\.html/, web);
app.use('/service', bodyParser.json(), service);
app.use(express.static(__dirname + '/web'));
app.use(/.*/, web);


if (app.get('env') === 'development') {
  app.use('/service', errorhandler());
} else if (app.get('env') === 'development') {
  // trust first proxy
  app.set('trust proxy', 1);
}

app.listen(3000, function log() {
  debug('The server is running at http://localhost:3000/');
});
