const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const routes = require('routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, inflate: false }));
app.use('/api/', routes);

const handler = serverless(app);

module.exports = handler;
