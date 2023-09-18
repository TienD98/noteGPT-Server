const express = require('express');
const validateRouter = express.Router();

validateRouter.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        console.log("in validate: " + req.isAuthenticated())
        return res.status(201).json({ authenticate: true });
    }
    console.log("in validate: " + req.isAuthenticated())
    return res.status(201).json({ authenticate: false });
});

module.exports = validateRouter