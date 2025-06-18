const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productList = [
  { name: "Mini Bloom Bag", price: "£1,495", image: "images/product2.jpg" },
  { name: "Large Bloom Bag", price: "£2,195", image: "images/product3.jpg" },
  { name: "Bucket Bloom Bag", price: "£1,695", image: "images/product9.jpg" }
];

router.get('/', (req, res) => {
  res.render('index', { products: productList, session: req.session });
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