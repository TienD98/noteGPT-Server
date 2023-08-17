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

// githubRouter.get('/callback', (req, res, next) => {
//     passport.authenticate('github', (err, user, info) => {
//         if (err) { return res.status(500).send('error server'); }
//         if (!user) { return res.status(404).send('user not found ' + info); }
//         req.logIn(user, (err) => {
//             if (err) {
//                 return res.status(500).send(err);
//             }
//             // Redirect or respond as appropriate for your application
//             return res.status(200).send('success');
//         });
//     })(req, res, next); // Make sure to call the function with req, res, and next
// });

githubRouter.get('/callback',
    passport.authenticate('github',
        { failureRedirect: 'https://tiend98.github.io/noteGPT/#/login' }), (req, res) => {
            console.log("GitHub callback route was hit");

            res.redirect('https://tiend98.github.io/noteGPT/#/');
        });

module.exports = githubRouter;