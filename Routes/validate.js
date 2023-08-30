const express = require('express');
const validateRouter = express.Router();

validateRouter.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(201).json({ authenticate: true });
    }
    return res.status(201).json({ authenticate: false });
});

module.exports = validateRouter