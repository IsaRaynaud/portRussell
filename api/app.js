console.log("Le serveur démarre...");
const express = require('express');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'env/.env') });

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const catwaysRouter = require('./routes/catways');
const reservationsRouter = require('./routes/reservations');

const app = express();

const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

console.log('Montage des routes...');
app.use('/', indexRouter);
console.log("Route '/' chargée");
app.use('/catways', catwaysRouter);
console.log("Route '/catways' chargée");
app.use('/catways/:catwayNumber/reservations', (req, res, next) => {
    req.params.catwayNumber = req.params.catwayNumber;
    next();
}, reservationsRouter);
console.log("Route '/reservations' chargée");

app.use(function(req, res, next) {
    res.status(404).json({name:'API', version: '1.0', status:404, message: 'Introuvable'});
});

module.exports = app;
