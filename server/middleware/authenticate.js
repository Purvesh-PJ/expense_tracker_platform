// backend/app/middleware/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // console.log(req.headers);
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Authorization required' });
    }

    try {
        const decoded = jwt.verify(token, '4f8d2f9f19a0c4395acb9d2545c7cd9845e1b5bc2f73f4de3d7a672c47c9b45c');
        console.log(decoded);
        req.userId = decoded.id; // Attach userId to request object
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticate };
