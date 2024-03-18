// app.js

// Require necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up sessions middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.post('/register', (req, res) => {
    const { phone } = req.body;

    // Read the users.json file
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error.' });
        }

        // Parse JSON data
        const users = JSON.parse(data);

        // Check if phone number already exists
        const existingUser = users.find(user => user.phone === phone);
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already exists.' });
        }

        // Continue with registration process if phone number is unique
        // Save user to the database, etc.
        // return success response
    });
});

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define routes
app.use('/', require('./routes/index'));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
// Use route handlers
app.use('/', indexRouter);
app.use('/users', usersRouter); // Base URL for user-related routes
app.use('/admin', adminRouter); // Base URL for admin-related routes


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// app.js

// Require route handlers
