const express = require('express');
const welcomeRouter = express.Router();
const session = require("express-session");

welcomeRouter.get('/', (req, res) => {
    res.status(200).send(req.session.user);
})

module.exports = welcomeRouter