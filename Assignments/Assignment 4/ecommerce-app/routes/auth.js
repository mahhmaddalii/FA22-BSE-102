const express = require('express');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        cart: req.session.cart || []
    });
});

// Register page
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        cart: req.session.cart || []
    });
});

// Login process
router.post('/login', (req, res) => {
    // Add your login logic here
    req.session.message = {
        type: 'success',
        text: 'Login successful'
    };
    res.redirect('/');
});

// Register process
router.post('/register', (req, res) => {
    // Add your registration logic here
    req.session.message = {
        type: 'success',
        text: 'Registration successful'
    };
    res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

module.exports = router; 