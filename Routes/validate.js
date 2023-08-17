const express = require('express');
const validateRouter = express.Router();

validateRouter.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.send(200).json({ authenticate: true });
    }
    return res.status(401).send('not login');
});

module.exports = validateRouter