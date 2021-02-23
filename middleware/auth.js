const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/app');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).send('Token not provided');
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        jwt.verify(token, jwtSecret);
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            res.status(401).send('Invalid token');
        }
    }
    next();
};