const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

async function createAdminUser() {
    try {
        // Connect to database
        await connectDB();

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser(); 