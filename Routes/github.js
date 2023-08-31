const express = require('express');
const passport = require('passport');
const githubRouter = express.Router();

githubRouter.get('/', passport.authenticate("github", { scope: ["user"] }));

githubRouter.get('/callback',
    passport.authenticate('github',
        { failureRedirect: 'https://tiend98.github.io/noteGPT/#/login' }), (req, res) => {
            res.status(200).send('hi');
            res.redirect('https://tiend98.github.io/noteGPT/#/main');
        });

module.exports = githubRouter;