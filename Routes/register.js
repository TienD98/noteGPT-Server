const pool = require('../DB/db');
const express = require('express');
const registerRouter = express.Router();
const cors = require('cors');
const bcrypt = require("bcryptjs");

registerRouter.use(cors());

// regiter route for new user
registerRouter.post('/', (req, res) => {
    //parse the info from user in client side
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);

    //get the usernames from database
    pool.query('select username from users;', (error, results) => {
        //error check for database connection
        if (error) {
            return res.status(500).send("Error with database!");
        }
        //error check for username from client
        if (!username) {
            return res.status(501).send("Error username!");
        }

        //error check for if username is exist
        for (const user of results.rows) {
            if (user.username === username) {
                return res.json("user exist!");
            }
        }

        //register user to database
        pool.query('insert into users (username, password) values ($1, $2);', [username, hash], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(401).json("database register fail!");
            }
            req.session.authenticated = true;
            req.session.user = {
                username: username,
                password: password,
                hashedPassword: hash
            }
            return res.status(200).json('Success register!');
        })
    });
});


module.exports = registerRouter;