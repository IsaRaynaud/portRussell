const express = require('express');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'env/.env') });

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const catwaysRouter = require('./routes/catways');
const reservationsRouter = require('./routes/reservations');
const usersRouter = require('./routes/users');

const app = express();

const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware pour afficher toutes les requêtes reçues
app.use((req, res, next) => {
    console.log(`🛰  ${req.method} ${req.originalUrl}`);
    console.log("📦 Body reçu :", req.body);
    next();
});

app.use(cookieParser());

app.use('/', indexRouter);
app.use('/catways', catwaysRouter);
app.use('/catways/:catwayNumber/reservations', reservationsRouter);
app.use('/users', usersRouter );

// Routes API
app.use('/api/users', usersRouter);

app.use(function(req, res, next) {
    res.status(404).json({name:'API', version: '1.0', status:404, message: 'Introuvable'});
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

module.exports = app;
