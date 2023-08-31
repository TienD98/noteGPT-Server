const pool = require('../DB/db');
const express = require('express');
const registerRouter = express.Router();
const bcrypt = require("bcryptjs");

// regiter route for new user
registerRouter.post('/', (req, res, next) => {
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
                return res.status(401).json("database register fail!");
            }
            next();
        })
    });
});
registerRouter.use((req, res) => {
    const username = req.body.username;

    pool.query('select id from users where username=$1;', [username], (error, results) => {
        if (error) {
            return res.status(500).send(error.message);
        } else if (results.rows.length === 0) {
            return res.status(404).send('user not found');
        } else {
            pool.query('INSERT INTO notes (users_id, title, note) values ($1, $2, $3);', [results.rows[0].id, 'Welcome', 'Here is where you can write notes'], (error, results) => {
                if (error) {
                    return res.status(500).send(error.message);
                } else {
                    console.log(results);
                    return res.status(200).send('add note success');
                }
            });
        }
    })
})

module.exports = registerRouter;