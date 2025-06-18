const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { isAuthenticated } = require('../middleware/auth');

// Get user's orders
router.get('/my-orders', isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.render('orders', {
            title: 'My Orders',
            orders,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Error fetching orders' 
        });
    }
});

module.exports = router; 