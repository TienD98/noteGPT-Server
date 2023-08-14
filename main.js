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
const allowedOrigins = ['https://tiend98.github.io', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// app.use(cors({
//     origin: 'https://tiend98.github.io',
//     credentials: true,
// }));
// app.use((req, res, next) => {
//     res.set({
//         "Access-Control-Allow-Origin": "https://tiend98.github.io",
//         "Access-Control-Allow-Methods": "*",
//         "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
//     });
//     next();
// });
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.set('trust proxy', 1);
app.use(
    session({
        secret: 'ASD123!@#',
        resave: false,
        saveUninitialized: true,
        store,
        cookie: { httpOnly: false, maxAge: 1000 * 60 * 60 * 24, secure: false, sameSite: "none" }
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