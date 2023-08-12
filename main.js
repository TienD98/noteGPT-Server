require('dotenv').config();
const express = require('express');
const app = express();
const registerRouter = require('./Routes/register');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const signinRouter = require('./Routes/signin');
const session = require("express-session");
const store = new session.MemoryStore();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: { maxAge: 1000 * 60 * 60 * 24, secure: true, sameSite: "none" }
    })
)

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'https://tiend98.github.io');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

app.get('/', (req, res) => {
    res.send('Hello, Wolrd!');
})
app.use('/register', registerRouter);
app.use('/signin', signinRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})