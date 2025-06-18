const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secretKey123',
  resave: false,
  saveUninitialized: true
}));

// View engine
app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));
app.set('layout', './layouts/layout');

// Routes
const routes = require('./routes/index');
app.use('/', routes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
