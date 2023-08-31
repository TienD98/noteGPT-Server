const express = require('express');
const passport = require('passport');
const pool = require('../DB/db');
const githubRouter = express.Router();

githubRouter.get('/', passport.authenticate("github", { scope: ["user"] }));

githubRouter.get('/callback',
    passport.authenticate('github',
        { failureRedirect: 'https://tiend98.github.io/noteGPT/#/login' }), (req, res) => {
            res.redirect('https://tiend98.github.io/noteGPT/#/main');
            pool.query('INSERT INTO notes (users_id, title, note) values ($1, $2, $3);', [req.user.id, 'Welcome', 'Here is where you can write notes'], (error, results) => {
                if (error) {
                    console.log(error.message);
                } else {
                    console.log(results);
                }
            });
        });

module.exports = githubRouter;