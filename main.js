require('dotenv').config();
const express = require('express');
const app = express();
const registerRouter = require('./Routes/register');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const signinRouter = require('./Routes/signin');
const welcomeRouter = require('./Routes/welcome');
const session = require("express-session");
const store = new session.MemoryStore();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./DB/db');
const bcrypt = require("bcryptjs");

//allow local and https crost origin
const corsOptions = {
    origin: ['https://tiend98.github.io', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.enable('trust proxy');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
    session({
        secret: 'ASD123!@#',
        resave: false,
        saveUninitialized: true,
        store,
        cookie: {
            sameSite: "none",
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24,
            secure: true
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/register', registerRouter);
app.use('/signin', signinRouter);

function ensureAuthenticate(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(403).json({ msg: "You're not authorized to view this page" })
    }
}

passport.use(
    new LocalStrategy(function (username, password, done) {
        pool.query('select * from users where username = $1;', [username], (err, res) => {
            const user = res.rows[0];
            if (err) return done(err, { msg: "bad request" });
            if (!user) return done(null, false, { msg: "user not found" });
            if (!bcrypt.compareSync(password, user.password)) return done(null, false, { msg: "password not correct" });
            return done(null, user);
        })
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('select * from users where id = $1', [id], (err, res) => {
        if (err) return done(err);
        done(null, res.rows[0]);
    })
});

app.get('/logout', (req, res) => {
    req.logOut(() => { res.status(200).send("logout success"); });
});

app.use('/welcome', ensureAuthenticate, welcomeRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})