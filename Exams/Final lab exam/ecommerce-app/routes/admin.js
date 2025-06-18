const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');
const isAdmin = require('../middleware/adminAuth');

// Apply admin middleware to all routes
router.use(isAdmin);

// Admin dashboard
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        const orders = await Order.find().populate('user');
        const complaints = await Complaint.find();
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            products,
            orders,
            complaints
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading admin dashboard'
        });
    }
});

// Product Management Routes
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/products', {
            title: 'Manage Products',
            products
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading products'
        });
    }
});

router.get('/products/add', (req, res) => {
    res.render('admin/product-form', {
        title: 'Add Product',
        product: null
    });
});

router.post('/products/add', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        req.session.message = {
            type: 'success',
            message: 'Product added successfully'
        };
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error adding product'
        });
    }
});

router.get('/products/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('admin/product-form', {
            title: 'Edit Product',
            product
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading product'
        });
    }
});

router.post('/products/edit/:id', async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        req.session.message = {
            type: 'success',
            message: 'Product updated successfully'
        };
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error updating product'
        });
    }
});

router.post('/products/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        req.session.message = {
            type: 'success',
            message: 'Product deleted successfully'
        };
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error deleting product'
        });
    }
});

// Order Management Routes
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user')
            .sort({ createdAt: -1 });
        res.render('admin/orders', {
            title: 'Manage Orders',
            orders
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error loading orders'
        });
    }
});

router.post('/orders/update-status/:id', async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
        req.session.message = {
            type: 'success',
            message: 'Order status updated successfully'
        };
        res.redirect('/admin/orders');
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error updating order status'
        });
    }
});

module.exports = router; 