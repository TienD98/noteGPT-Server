require('dotenv').config();
const express = require('express');
const app = express();
const registerRouter = require('./Routes/register');
const bodyParser = require('body-parser');
// const cors = require('cors');
const morgan = require('morgan');
const signinRouter = require('./Routes/signin');
const welcomeRouter = require('./Routes/welcome');
// const allowedOrigins = ['https://tiend98.github.io', 'http://localhost:3000'];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
// }));

// app.use(cors({
//     origin: 'https://tiend98.github.io',
//     credentials: true,
// }));
app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:5173",
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