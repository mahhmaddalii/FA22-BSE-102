const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        req.session.message = {
            type: 'error',
            message: 'Access denied. Admin privileges required.'
        };
        res.redirect('/auth/login');
    }
};

module.exports = isAdmin; 