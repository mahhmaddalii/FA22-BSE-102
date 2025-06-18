const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Initialize cart in session if it doesn't exist
const initializeCart = (req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
};

// Add to cart
router.post('/add', initializeCart, (req, res) => {
    const { productId, title, price, quantity = 1 } = req.body;
    
    const existingItem = req.session.cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        req.session.cart.push({
            productId,
            title,
            price: parseFloat(price),
            quantity: parseInt(quantity)
        });
    }
    
    res.redirect('/cart');
});

// View cart
router.get('/', initializeCart, (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.render('cart', {
        cart,
        total,
        title: 'Shopping Cart'
    });
});

// Update cart item quantity
router.post('/update', initializeCart, (req, res) => {
    const { productId, quantity } = req.body;
    const item = req.session.cart.find(item => item.productId === productId);
    
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        }
    }
    
    res.redirect('/cart');
});

// Remove item from cart
router.post('/remove', initializeCart, (req, res) => {
    const { productId } = req.body;
    req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    res.redirect('/cart');
});

// Checkout page
router.get('/checkout', initializeCart, (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.render('checkout', {
        cart,
        total,
        title: 'Checkout'
    });
});

// Place order
router.post('/place-order', initializeCart, async (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        // Create new order
        const order = new Order({
            user: req.session.user ? req.session.user.id : null,
            items: cart.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: total
        });

        // Save order to database
        await order.save();

        // Clear cart
        req.session.cart = [];
        
        req.session.message = {
            type: 'success',
            text: 'Order placed successfully!'
        };
        res.redirect('/');
    } catch (error) {
        console.error('Error placing order:', error);
        req.session.message = {
            type: 'error',
            text: 'Error placing order. Please try again.'
        };
        res.redirect('/cart/checkout');
    }
});

module.exports = router; 