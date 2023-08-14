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
        cookie: { maxAge: 1000 * 60 * 60 * 24, secure: true, sameSite: 'none' }
    })
)
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(cors());

const corsOptions = {
    origin: ['https://tiend98.github.io', 'http://localhost:5173'],
    credentials: true,
    methods: 'GET, POST, PUT, DELETE',
};

app.use(cors(corsOptions));

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