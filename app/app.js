var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const ValidationError = require('express-json-validator');
const studentInfoRoutes = require('./api/routes/studentInfo');
const registrationRoutes = require('./api/routes/registrationRoute');
const ApiErrResponse = require('./api/model/ApiErrorResponse');
const logger = require('./api/config/loggingConfig');
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Content-Type",'application/json');
    next();
  });
app.use('/api',studentInfoRoutes);
app.use('/api',registrationRoutes);

app.listen(8188);
logger.info('Running on port 8080')

app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.error('Bad JSON');
    res.status(400).json(new ApiErrResponse('Invalid JSON format'));
  } 
});
