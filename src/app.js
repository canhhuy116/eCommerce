require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middleware
app.use(morgan('dev')); // log request
app.use(helmet()); // secure http headers
app.use(compression()); // compress response
app.use(express.json()); // parse json body
app.use(express.urlencoded({ extended: true })); // parse urlencoded body

// init db
require('./dbs/init.mongodb');
const { checkOverLoad } = require('./helpers/check.connect');
// checkOverLoad();

// init routes
app.use('/v1/api', require('./routes/index'));

// handling error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
