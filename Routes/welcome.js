const express = require('express');
const welcomeRouter = express.Router();

welcomeRouter.get('/', (req, res) => {
    console.log('hi1');
    console.log(req.session);
    res.status(200).json(req.session.user);
})

module.exports = welcomeRouter