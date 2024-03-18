// routes/index.js

const express = require('express');
const router = express.Router();
const users = require('../data/users.json'); // Assuming user data is stored in a JSON file
const usersRouter = require('./users');

// Homepage route
router.get('/', (req, res) => {
    res.render('index');
});

// Login route
router.get('/login', (req, res) => {
    // Check if there is an error message passed from a failed login attempt
    const error = req.query.error ? req.query.error : null;
    res.render('login', { error }); // Render the login form with optional error message
});

// Registration route
router.get('/registration', (req, res) => {
    res.render('registration'); // Render the registration form
});

// Include user routes
router.use('/user', usersRouter);

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Perform authentication (e.g., check credentials against stored user data)
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        // Store user information in the session
        req.session.user = user;
        
        // Determine the user's dashboard based on their role
        let dashboardRoute;
        if (user.role === 'admin') {
            dashboardRoute = '/admin/dashboard';
        } else {
            dashboardRoute = '/user/dashboard';
        }
        
        // Redirect the user to their dashboard
        res.redirect(dashboardRoute);
    } else {
        // Redirect to login page with error message
        res.status(401).send('Invalid username or password');

        // res.redirect('/login?error=Invalid username or password');
    }
});

// Registration route
router.post('/register', (req, res) => {
    const { username, password, age, address, phone } = req.body;

    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('Username already exists');
    }

    // Assign role based on existing admin user
    const adminExists = users.some(user => user.role === 'admin');
    const role = adminExists ? 'user' : 'admin';

    // Add new user to user data
    users.push({ username, password, role, age, address, phone });

    // Save updated user data (assuming synchronous operation for simplicity)
    const fs = require('fs');
    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

    // Redirect to appropriate dashboard based on role
    if (role === 'admin') {
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/user/dashboard');
    }
});

router.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.sendStatus(500);
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

module.exports = router;
