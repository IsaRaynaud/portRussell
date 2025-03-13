const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
//

//const usersRouter = require('./routes/users');

cont app = express();

app.use(cors({
    exposedHeaders: [Authorization],
    origin: '*'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.use(function(req, res, next) {
    res.status(404).json({name:'API', version: '1.0', status:404, message: 'Introuvable'});
});

module.exports = app;
