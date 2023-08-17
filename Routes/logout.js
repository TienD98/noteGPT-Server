const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res, next) => {
    console.log(req.session);
    req.logout((err) => {
        if (err) {
            return res.status(400).send('err');
        }
        console.log(req.session);
        return res.status(200).send("logout success");
    });
});

module.exports = logoutRouter;