const express = require("express");
const authorize = express.Router();

authorize.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(400).send('You are not authorized!');
    }
})

module.exports = authorize