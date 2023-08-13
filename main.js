require('dotenv').config();
const express = require('express');
const app = express();
const registerRouter = require('./Routes/register');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const signinRouter = require('./Routes/signin');
const session = require("express-session");
const welcomeRouter = require('./Routes/welcome');
const store = new session.MemoryStore();

app.set('trust proxy', 1);
app.use(
    session({
        secret: 'ASD123!@#',
        resave: false,
        saveUninitialized: true,
        store,
        cookie: { maxAge: 1000 * 60 * 60 * 24, secure: true, sameSite: "none" }
    })
)
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://tiend98.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res) => {
    res.send('Hello, Wolrd!');
})
app.use('/register', registerRouter);
app.use('/signin', signinRouter);

function ensureAuthenticate(req, res, next) {
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