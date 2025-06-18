const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// Register page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { 
                title: 'Register',
                error: 'Email already registered' 
            });
        }

        // Create new user
        const user = new User({ email, password });
        await user.save();

        // Set session
        req.session.user = {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
        };

        res.redirect('/');
    } catch (error) {
        res.render('register', { 
            title: 'Register',
            error: 'Registration failed' 
        });
    }
});

// Login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { 
                title: 'Login',
                error: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { 
                title: 'Login',
                error: 'Invalid credentials' 
            });
        }

        // Set session
        req.session.user = {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
        };

        res.redirect('/');
    } catch (error) {
        res.render('login', { 
            title: 'Login',
            error: 'Login failed' 
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router; 