const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', {
            title: 'All Products',
            products,
            cart: req.session.cart || []
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        req.session.message = {
            type: 'error',
            text: 'Error loading products'
        };
        res.redirect('/');
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.session.message = {
                type: 'error',
                text: 'Product not found'
            };
            return res.redirect('/products');
        }
        res.render('product-detail', {
            title: product.title,
            product,
            cart: req.session.cart || []
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        req.session.message = {
            type: 'error',
            text: 'Error loading product'
        };
        res.redirect('/products');
    }
});

module.exports = router; 