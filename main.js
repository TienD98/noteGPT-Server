require('dotenv').config();
const express = require('express');
const app = express();
const registerRouter = require('./Routes/register');
const bodyParser = require('body-parser');
// const cors = require('cors');
const morgan = require('morgan');
const signinRouter = require('./Routes/signin');
const session = require("express-session");
const welcomeRouter = require('./Routes/welcome');
// const store = new session.MemoryStore();
const MemoryStore = require('session-memory-store')(session);

app.use(morgan('dev'));
app.use(bodyParser.json());

const corsOptions = {
    origin: 'https://tiend98.github.io',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // This allows cookies to be sent with the request
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.set('trust proxy', 1);
app.use(
    session({
        secret: 'ASD123!@#',
        resave: false,
        saveUninitialized: true,
        MemoryStore,
        cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: false, sameSite: true }
    })
)


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