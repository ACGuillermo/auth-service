
const express = require('express');
const bodyParser = require('body-parser')

require('dotenv').config();


const middlewares = require('./middlewares');
const api = require('./api')

const app = express();

app.use(bodyParser.json());

app.use('/api', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;