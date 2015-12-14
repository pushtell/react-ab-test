require("babel-core/register")({only: /Component|www/});

var express = require('express');
var session = require('express-session');
var React = require("react");
var ReactDOMServer = require("react-dom/server");
var Component = require("./Component.jsx");

var app = express();

app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
  var reactElement = React.createElement(Component, {userIdentifier: req.sessionID});
  var reactString = ReactDOMServer.renderToString(reactElement);
  res.render('template', {
    sessionID: req.sessionID,
    reactOutput: reactString
  });
});

app.use(express.static('www'));

app.listen(8080);
