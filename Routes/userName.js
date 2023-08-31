const express = require('express');
const pool = require('../DB/db');
const userNameRouter = express.Router();

userNameRouter.get('/', (req, res) => {
    res.status(200).send('welcome!');
});

userNameRouter.get('/username', (req, res) => {
    const user = req.user.username;
    if (user) {
        res.status(202).send(user);
    } else {
        res.status(401).send('username not exist!')
    }
})

module.exports = userNameRouter