const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

const products = [
    {
        title: "Midi Bloom Bag",
        description: "A beautiful midi-sized bloom bag perfect for everyday use",
        price: 1795,
        image: "/images/product1.jpg",
        category: "Bags",
        stock: 10
    },
    {
        title: "Mini Bloom Bag",
        description: "Compact and stylish mini bloom bag",
        price: 1495,
        image: "/images/product2.jpg",
        category: "Bags",
        stock: 15
    },
    {
        title: "Large Bloom Bag",
        description: "Spacious large bloom bag for all your needs",
        price: 2195,
        image: "/images/product3.jpg",
        category: "Bags",
        stock: 8
    },
    {
        title: "Crossbody Bloom Bag",
        description: "Comfortable crossbody bloom bag",
        price: 1295,
        image: "/images/product4.jpg",
        category: "Bags",
        stock: 12
    }
];

const seedProducts = async () => {
    try {
        await connectDB();
        
        // Clear existing products
        await Product.deleteMany({});
        
        // Insert new products
        await Product.insertMany(products);
        
        console.log('Products seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts(); 