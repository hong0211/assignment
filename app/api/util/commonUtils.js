const validator = require('email-validator');
const ApiErrResponse = require('../model/ApiErrorResponse');
const logger = require('../config/loggingConfig');

var Utils = {
    checkIsDbEmptyResults: function(dbResults) {
        if (typeof dbResults == 'undefined' || dbResults.length == 0) {
            return true;
        }
        return false;
    },
    validateEmailAddress: function(email) {
        if (validator.validate(email) == false || email.length >= 255) {
            return false;
        }
        return true;
    },
    constructEmailOnlyArray: function(dbResults) {
        var output = [];
        dbResults.forEach(element => {
            output.push(element.EMAIL);
        });
        return output;
    },
    processInParamsForSqlStatements: function(sqlStatement, inputArr) {
        var paramCount = "";
        var processedSql = sqlStatement;
        inputArr.forEach(element => {
            paramCount += "?,";
        });
        processedSql = processedSql.replace('IN_PARAMS', paramCount.substr(0,paramCount.length - 1));
        logger.debug(processedSql);
        return processedSql;
    },
    populateInParams: function(inputArr) {
        var params = [];
        inputArr.forEach((element) => {
            params.push(element);
        });
        return params;
    },
    getStatusCodeBasedOnResponse: function(responseObj) {
        var statusCode = 200;
        if (responseObj instanceof ApiErrResponse) {
            statusCode = 400;
        }
        return statusCode;
    }
}

module.exports = Utils;