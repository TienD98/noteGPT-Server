require('dotenv').config();
const express = require('express');
const app = express();
const registerRouter = require('./Routes/register');
const bodyParser = require('body-parser');
// const cors = require('cors');
const morgan = require('morgan');
const signinRouter = require('./Routes/signin');
const welcomeRouter = require('./Routes/welcome');
const session = require("express-session");
const store = new session.MemoryStore();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// signinRouter.use(cors());
app.use(
    session({
        secret: 'ASD123!@#',
        resave: false,
        saveUninitialized: true,
        store,
        cookie: { sameSite: "None", httpOnly: false, maxAge: 1000 * 60 * 60 * 24, secure: true }
    })
);

app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "https://tiend98.github.io",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.set('trust proxy', 1);


app.get('/', (req, res) => {
    res.send('Hello, Wolrd!');
})
app.use('/register', registerRouter);
app.use('/signin', signinRouter);

function ensureAuthenticate(req, res, next) {
    console.log(req.session);
    console.log(req.session.authenticated);
    if (req.session.authenticated) {
        return next();
    } else {
        console.log(req.session.authenticated);
        res.status(403).json({ msg: "You're not authorized to view this page" })
    }
}

app.use('/welcome', ensureAuthenticate, welcomeRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})