const express = require('express');
const passport = require('passport');
const githubRouter = express.Router();

githubRouter.get('/', passport.authenticate("github", { scope: ["user"] }));

// githubRouter.get('/callback', (req, res, next) => {
//     passport.authenticate('github', (err, user, info) => {
//         if (err) { return res.status(500).send('error server') };
//         if (!user) { return res.status(404).send('usernot found ' + info) };
//         req.logIn(user, (err) => {
//             if (err) {
//                 return res.status(500).send(err);
//             }
//             // Redirect or respond as appropriate for your application
//             return res.status(200).send('success');
//         });
//     })

// });

githubRouter.get('/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication
        res.redirect('/');
    });

module.exports = githubRouter;