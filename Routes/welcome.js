const express = require('express');
const welcomeRouter = express.Router();

welcomeRouter.get('/', (req, res) => {
    res.status(200).send('welcome!');
})

module.exports = welcomeRouter