const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const catwaysRouter = require('./routes/catways');

const app = express();

const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

app.use(cors({
    exposedHeaders: [Authorization],
    origin: '*'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/catways', catwaysRouter);

app.use(function(req, res, next) {
    res.status(404).json({name:'API', version: '1.0', status:404, message: 'Introuvable'});
});

module.exports = app;
