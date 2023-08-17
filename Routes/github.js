const express = require('express');
const passport = require('passport');
const githubRouter = express.Router();

// githubRouter.get('/', (req, res) => {
//     if (req.isAuthenticated()) {
//         return res.send(200).json({ authenticate: true });
//     }
//     return res.status(401).send('not login');
// });

githubRouter.get('/', passport.authenticate("github", { scope: ["user"] }));

githubRouter.get('/callback',
    passport.authenticate('github',
        { failureRedirect: 'https://tiend98.github.io/noteGPT/#/login' }), (req, res) => {
            console.log("GitHub callback route was hit");

            res.redirect('https://tiend98.github.io/noteGPT/#/');
        });

module.exports = githubRouter;