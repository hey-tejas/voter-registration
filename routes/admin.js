// routes/admin.js

const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticate'); // Import authentication middleware
const fs = require('fs');
const users = require('../data/users.json');
router.use(authenticateUser);

// Admin Dashboard route
router.get('/dashboard', (req, res) => {
    const adminUser = req.session.user;
    if (adminUser && adminUser.role === 'admin') {
        res.render('admin', { user: adminUser, users: users }); // Pass 'user' object and 'users' data to the view
    } else {
        res.redirect('/login'); // Redirect unauthorized users to login page
    }
});

// Search voters route
// admin.js

router.post('/search', (req, res) => {
    const { query } = req.body;
    const adminUser = req.session.user;

    if (!adminUser || adminUser.role !== 'admin') {
        res.redirect('/login'); // Redirect unauthorized users to login page
        return;
    }

    // Filter users by name or phone number
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.phone.includes(query)
    );
    console.log('Search Query:', query); // Log search query
    console.log('Filtered Users:', filteredUsers); // Log filtered users for debugging

    res.json(filteredUsers);
});



router.post('/delete', (req, res) => {
    const adminUser = req.session.user;
    const { username } = req.body;

    // Check if the logged-in user is an admin
    if (adminUser && adminUser.role === 'admin') {
        // Find the index of the user to be deleted
        const index = users.findIndex(user => user.username === username);

        // If user exists, delete it from the users array
        if (index !== -1) {
            users.splice(index, 1);

            // Save updated user data (assuming synchronous operation for simplicity)
            fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

            res.status(200).send('User deleted successfully');
        } else {
            res.status(404).send('User not found');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

module.exports = router;
