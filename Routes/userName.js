const express = require('express');
const pool = require('../DB/db');
const userNameRouter = express.Router();
const errordatabase = 'error with database query';

userNameRouter.use((req, res, next) => {
    const userid = req.user.id;
    req.id = userid;
    next();
});

userNameRouter.get('/', (req, res) => {
    console.log(req.id);
    res.status(200).send('welcome!');
});

userNameRouter.get('/username', (req, res) => {
    const user = req.user.username;
    if (user) {
        res.status(202).send(user);
    } else {
        res.status(401).send('username not exist!')
    }
})

userNameRouter.post('/addnote', (req, res) => {
    const title = req.body.title, note = req.body.note;
    if (!title || !note || !userid) {
        return res.status(400).send('error with user input!');
    }
    pool.query('INSERT INTO notes (users_id, title, note) VALUES ($1, $2, $3);', [req.id, title, note], (err, result) => {
        if (err) {
            return res.status(500).send(errordatabase);
        } else {
            return res.status(200).send('note added to db!');
        }
    })
})

userNameRouter.get('/getnote', (req, res) => {
    pool.query('SELECT id, title, note from notes where users_id=$1;', [req.id], (err, result) => {
        if (err) {
            return res.status(500).send(errordatabase);
        } else {
            return res.status(202).send(result.rows);
        }
    })
})

userNameRouter.delete('/delete/:id', (req, res) => {
    pool.query('DELETE FROM notes where id=$1;', [req.params.id], (error, result) => {
        if (error) {
            return res.status(500).send(errordatabase);
        } else {
            return res.status(200).send('delete note from db success!');
        }
    })
})

userNameRouter.put('/update', (req, res, next) => {
    const noteid = req.body.id, title = req.body.title, note = req.body.note;
    if (!noteid || !title || !note) {
        res.status(400).send('bad user input');
    }
    pool.query('select title, note from notes where id=$1;', [noteid], (err, result) => {
        //
        console.log(result.rows);
        const databaseTitle = result.rows[0].title, databaseNote = result.rows[0].note;
        if (err) {
            return res.status(500).send(errordatabase);
        } else if (databaseTitle === title && databaseNote === note) {
            return res.status(400).send('nothing changed compared to the stored data');
        } else {
            next();
        }
    })
}, (req, res) => {
    pool.query('UPDATE notes SET title=$1, note=$2 where id=$3;', [req.body.title, req.body.note, req.id], (err, result) => {
        if (err) {
            return res.status(500).send(errordatabase);
        } else {
            return res.status(200).send('update note success');
        }
    })
})

module.exports = userNameRouter