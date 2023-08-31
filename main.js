require('dotenv').config();
const express = require('express');
const app = express();
const registerRouter = require('./Routes/register');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const signinRouter = require('./Routes/signin');
const userNameRouter = require('./Routes/userName');
const session = require("express-session");
const store = new session.MemoryStore();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./DB/db');
const bcrypt = require("bcryptjs");
const logoutRouter = require('./Routes/logout');
const githubRouter = require('./Routes/github');
const GitHubStrategy = require("passport-github2").Strategy;
const validateRouter = require('./Routes/validate');

//allow local and https crost origin
const corsOptions = {
    origin: ['https://tiend98.github.io', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

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

passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://notegpt-686471fdfc45.herokuapp.com/auth/github/callback",
    },
        (accessToken, refreshToken, profile, done) => {
            console.log(req.session);
            return done(null, profile);
        })
)

passport.serializeUser((user, done) => {
    // done(null, user.id);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    if (user.origin === 'local') {
        pool.query('select * from users where id = $1', [user.id], (err, res) => {
            if (err) return done(err);
            done(null, res.rows[0]);
        })
    } else {
        done(null, user);
    }
});

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
app.use('/profile', ensureAuthenticate, userNameRouter);
app.use('/logout', logoutRouter);
app.use('/auth/github', githubRouter);
app.use('/validate', validateRouter);

app.get('/logout', (req, res) => {
    console.log(req.session);
    console.log(req.user);
    req.logout((err) => {
        if (err) {
            return res.status(400).send('err');
        }
        console.log(req.session);
        console.log(req.user);

        return res.status(200).send("logout success");
    });
});



app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

function ensureAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(403).send("You're not authorized to get this request!");
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})