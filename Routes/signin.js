const express = require('express');
const signinRouter = express.Router();
const passport = require('../Utils/passport-config');

signinRouter.use((req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send('bad credential request!');
    } else {
        next();
    }
})

signinRouter.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return res.status(400).send('error in authenticate') };
        if (!user) { return res.status(401).send(info.msg) };
        req.logIn(user, (err) => {
            if (err) { return res.status(400).send(err) };
            return res.status(200).send('success login!');
        })
    })(req, res, next);
});

module.exports = signinRouter