const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product');

const productList = [
  { name: "Mini Bloom Bag", price: "£1,495", image: "images/product2.jpg" },
  { name: "Large Bloom Bag", price: "£2,195", image: "images/product3.jpg" },
  { name: "Bucket Bloom Bag", price: "£1,695", image: "images/product9.jpg" }
];

// Home page
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // fetch all products
        res.render('index', {
            title: 'Home',
            products,
            cart: req.session.cart || []
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('index', {
            title: 'Home',
            products: [],
            cart: req.session.cart || []
        });
    }
});

// About page
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us',
        cart: req.session.cart || []
    });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us',
        cart: req.session.cart || []
    });
});

// Products page
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', {
            title: 'Products',
            products,
            cart: req.session.cart || []
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('products', {
            title: 'Products',
            products: [],
            cart: req.session.cart || []
        });
    }
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../users.json')));
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const filePath = path.join(__dirname, '../users.json');
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(filePath));
  } catch (e) {}
  if (users.some(u => u.username === username)) {
    return res.render('register', { error: 'Username already taken' });
  }
  users.push({ username, password });
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;