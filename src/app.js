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
app.use('/', require('./routes/index'));
// handling error

module.exports = app;
