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


app.use('/', indexRouter);
app.use('/catways', catwaysRouter);
app.use('/reservations', reservationsRouter);

app.use(function(req, res, next) {
    res.status(404).json({name:'API', version: '1.0', status:404, message: 'Introuvable'});
});

module.exports = app;
