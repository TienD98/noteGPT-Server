const express = require('express');
const welcomeRouter = express.Router();
// const cors = require('cors');/

// welcomeRouter.use(cors());
welcomeRouter.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
        "Access-Control-Allow-Credentials": "true"
    });
    next();
});

welcomeRouter.get('/', (req, res) => {
    res.status(200).json(req.session.user);
})

module.exports = welcomeRouter