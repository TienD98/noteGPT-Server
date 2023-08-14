const express = require('express');
const welcomeRouter = express.Router();
const cors = require('cors');

welcomeRouter.use(cors());

welcomeRouter.get('/', (req, res) => {
    res.status(200).json(req.session.user);
})

module.exports = welcomeRouter