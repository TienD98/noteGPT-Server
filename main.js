require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const store = new session.MemoryStore();
const passport = require('passport');
const pool = require("./DB/db");
const app = express();

//Router imports
const signinRouter = require('./Routes/signin');
const userNameRouter = require('./Routes/userName');
const registerRouter = require('./Routes/register');
const logoutRouter = require('./Routes/logout');
const githubRouter = require('./Routes/github');
const validateRouter = require('./Routes/validate');

const corsOptions = {
    origin: ['https://tiend98.github.io', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cookieParser(process.env.SECRET));
app.use(cors(corsOptions));
app.enable('trust proxy');
app.use(morgan('dev'));
app.use(bodyParser.json());


//for local test comment out secure and samesite
app.use(
    session({
        secret: 'ASD123!@#',
        resave: false,
        saveUninitialized: true,
        store,
        proxy: true,
        cookie: {
            sameSite: 'none',
            httpOnly: true,
            maxAge: 1000 * 60 * 24,
            secure: true
        }
    })
);

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.set('Expires', '0');
    res.set('Pragma', 'no-cache');
    next();
});

app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => { res.status(200).send('hi') });
app.use('/register', registerRouter);
app.use('/signin', signinRouter);
app.use('/profile', userNameRouter);
app.use('/logout', logoutRouter);
app.use('/auth/github', githubRouter);
app.use('/validate', validateRouter);

module.exports = app;