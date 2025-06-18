const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Order = require('../models/Order');
const { isAuthenticated } = require('../middleware/auth');
const isAdmin = require('../middleware/adminAuth');

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// User: Submit complaint form
router.get('/submit', async (req, res) => {
    try {
        // Get user's orders for dropdown
        const orders = await Order.find({ user: req.session.user.id })
            .sort({ createdAt: -1 });
        
        res.render('complaints/submit', {
            title: 'Submit Complaint',
            orders,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error loading complaint form:', error);
        req.session.message = {
            type: 'error',
            text: 'Error loading complaint form'
        };
        res.redirect('/');
    }
});

// User: Submit complaint
router.post('/submit', async (req, res) => {
    try {
        const { orderId, message } = req.body;
        
        // Validate that the order belongs to the user
        const order = await Order.findOne({ 
            _id: orderId, 
            user: req.session.user.id 
        });
        
        if (!order) {
            req.session.message = {
                type: 'error',
                text: 'Invalid order ID or order not found'
            };
            return res.redirect('/complaints/submit');
        }
        
        // Create new complaint
        const complaint = new Complaint({
            user: req.session.user.id,
            orderId: orderId,
            message: message
        });
        
        await complaint.save();
        
        req.session.message = {
            type: 'success',
            text: 'Complaint submitted successfully!'
        };
        res.redirect('/complaints/my-complaints');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        req.session.message = {
            type: 'error',
            text: 'Error submitting complaint. Please try again.'
        };
        res.redirect('/complaints/submit');
    }
});

// User: View their own complaints
router.get('/my-complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.session.user.id })
            .populate('orderId')
            .sort({ createdAt: -1 });
        
        res.render('complaints/my-complaints', {
            title: 'My Complaints',
            complaints,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        req.session.message = {
            type: 'error',
            text: 'Error loading complaints'
        };
        res.redirect('/');
    }
});

// Admin: View all complaints (admin only)
router.get('/admin/all', isAdmin, async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('user', 'name email')
            .populate('orderId')
            .sort({ createdAt: -1 });
        
        res.render('admin/complaints', {
            title: 'All Complaints',
            complaints,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching all complaints:', error);
        req.session.message = {
            type: 'error',
            text: 'Error loading complaints'
        };
        res.redirect('/admin');
    }
});

// Admin: Update complaint status
router.post('/admin/update-status/:id', isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        await Complaint.findByIdAndUpdate(req.params.id, { status });
        
        req.session.message = {
            type: 'success',
            text: 'Complaint status updated successfully'
        };
        res.redirect('/complaints/admin/all');
    } catch (error) {
        console.error('Error updating complaint status:', error);
        req.session.message = {
            type: 'error',
            text: 'Error updating complaint status'
        };
        res.redirect('/complaints/admin/all');
    }
});

module.exports = router; 