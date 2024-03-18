const express = require('express');
const router = express.Router();
const users = require('../data/users.json'); 
const path = require('path');
// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find the user in the users.json file
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // Redirect the user to their dashboard based on their role
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.sendFile(path.join(__dirname, '../views/user_dashboard.ejs'));        }
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Register route
router.post('/register', (req, res) => {
    // Handle voter registration here
    res.send('Registration successful');
});

// Update route
// users.js

router.post('/update', (req, res) => {
    const { username, age, address, phone } = req.body;
    const user = req.session.user;

    // Update user information in the session
    user.age = age;
    user.address = address;
    user.phone = phone;

    // Update user information in the JSON file
    const updatedUsers = users.map(u => {
        if (u.username === user.username) {
            return {
                ...u,
                age: user.age,
                address: user.address,
                phone: user.phone
            };
        }
        return u;
    });

    // Save updated user data (assuming synchronous operation for simplicity)
    const fs = require('fs');
    fs.writeFileSync('./data/users.json', JSON.stringify(updatedUsers, null, 2));

    res.redirect('/user/dashboard');
});


// User dashboard route
router.get('/dashboard', (req, res) => {
    const user = req.session.user;
    if (user && user.role === 'user') {
       
        user.age = user.age; // Add age field from user object
        user.address = user.address; // Add address field from user object
        user.phone = user.phone; // Add phone field from user object
        
        res.render('user_dashboard', { user: user });
    }
    else {
        res.redirect('/login'); // Redirect unauthorized users to login page
    }
});

module.exports = router;
