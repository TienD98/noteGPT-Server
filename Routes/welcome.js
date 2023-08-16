const express = require('express');
const pool = require('../DB/db');
const welcomeRouter = express.Router();

welcomeRouter.get('/', (req, res) => {
    res.status(200).send('welcome!');
});

welcomeRouter.get('/profile', (req, res) => {
    pool.query('select * from users where id = $1', [req.session.passport.user])
        .then((result) => {
            return res.status(200).send(result.rows[0]);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send('database err');
        })
})

module.exports = welcomeRouter