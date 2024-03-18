// middleware/authenticate.js

const authenticateUser = (req, res, next) => {
    if (req.session && req.session.user) {
        // User is authenticated
        next();
    } else {
        // User is not authenticated, redirect to login page
        res.redirect('/login');
    }
};

module.exports = authenticateUser;
