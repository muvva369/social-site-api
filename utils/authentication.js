const jwt = require('jsonwebtoken');
const secret = process.env.SECRET

// middleware -validation of the token recieved
module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(400).send("Hey!!! You doesn't seem like a logged in user..Please login");
    try {
        const verifiedCredentials = jwt.verify(token, secret);
        req.username = verifiedCredentials;
        next();
    } catch (err) {
        res.status(400).send('The token provided by you is either invalid or broken!!..Please check or login again');
    }
};