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
const corsOptions = {
    origin: ["https://tiend98.github.io", "http://localhost:3000"],
    credentials: true
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
            secure: false
        }
    })
);

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
// const express = require('express');
// const session = require('express-session');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const app = express();

// const corsOptions = {
//     origin: "https://tiend98.github.io",
//     credentials: true
// };
// app.use((req, res, next) => {
//     res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
//     next();
// });

// app.use((req, res, next) => {
//     console.log('CORS Pre-Flight:', req.headers.origin);
//     next();
// }, cors(corsOptions));

// app.use(cookieParser());
// app.enable('trust proxy');
// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         sameSite: 'none', // or 'strict', 'lax' as needed
//         secure: true,
//         httpOnly: false
//     }
// }));

// app.get('/noteGPT', (req, res) => {
//     // Check if the session has a visit count, if not, set it to 1
//     req.session.visitCount = req.session.visitCount ? req.session.visitCount + 1 : 1;
//     console.log(req.session.visitCount);
//     console.log('Session:', req.session);

//     res.send(`You have visited this page ${req.session.visitCount} times.`);
// });

// app.get('/setcookie', (req, res) => {
//     res.cookie('test', 'value', { sameSite: 'none', secure: true });
//     console.log('Session:', req.session);

//     res.send('Cookie set');
// });

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
// })