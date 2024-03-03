const GitHubStrategy = require("passport-github2").Strategy;
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const pool = require("../DB/db");
const bcrypt = require("bcryptjs");

passport.use(
    new LocalStrategy(function (username, password, done) {
        pool.query('select * from users where username = $1;', [username], (err, res) => {
            const user = res.rows[0];
            if (err) return done(err, { msg: "bad request" });
            if (!user) return done(null, false, { msg: "user not found!!!!" });
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
            return done(null, profile);
        })
)

passport.serializeUser((user, done) => {
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

module.exports = passport;