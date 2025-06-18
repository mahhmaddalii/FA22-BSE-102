const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secretKey123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using https
}));

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Make cart and user available to all views
app.use((req, res, next) => {
  res.locals.cart = req.session.cart || [];
  res.locals.user = req.session.user || null;
  next();
});

// View engine
app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));
app.set('layout', './layouts/layout');

// Routes
const indexRoutes = require('./routes/index');
const cartRoutes = require('./routes/cart');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const complaintRoutes = require('./routes/complaints');

app.use('/', indexRoutes);
app.use('/cart', cartRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/complaints', complaintRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Error',
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 Not Found',
    message: 'Page not found'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
