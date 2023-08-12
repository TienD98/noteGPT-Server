const express = require('express');
const signinRouter = express.Router();
const bcrypt = require("bcryptjs");
const pool = require('../DB/db');
const cors = require('cors');


signinRouter.use(cors());

//check if username exist
signinRouter.use((req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    pool.query('select username from users;', (error, result) => {
        //error check for database connection
        if (error) {
            console.log(error);
            return res.status(500).send("Error with database!");
        }

        let userFound = false;
        //error check for if username is exist
        for (const user of result.rows) {
            //found user
            if (user.username === username) {
                userFound = true;
                req.username = username;
                req.password = password;
                next();
            }
        }
        if (!userFound) { return res.status(401).send("Username not found!") };
    });
});

signinRouter.post('/', (req, res) => {

    pool.query('select password from users where username = $1;', [req.username], (error, result) => {
        if (error) {
            return res.status(501).send('fail');
        }

        if (!bcrypt.compareSync(req.password, result.rows[0].password)) {
            return res.status(401).send('fail');
        }
        return res.status(202).send('success');
    });

})

module.exports = signinRouter