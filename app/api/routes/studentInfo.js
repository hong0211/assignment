const express = require('express');
const router = express.Router();
const CommonResponse = require('../model/CommonStudentInfoRes');
const ApiErrResponse = require('../model/ApiErrorResponse');
const NotificationResponse = require('../model/NotificationsResponse');

const DataAccess = require('../dataAccess/dataAccess');
const { validate, ValidationError } = require('express-json-validator');
const Utils = require('../util/commonUtils');
const ApiRequestSchemas = require('../schema/ApiRequestSchema');
const registrationService = require('../service/RegistrationService');
const studentInfoService = require('../service/StudentInformationService');
var inputReqSchema = new ApiRequestSchemas();
const logger = require('../config/loggingConfig');

router.get('/commonstudents', (req, res, next) => {

    var teacherParam = req.query.teacher;
    logger.info('Triggering get common student with teacher email : ' + teacherParam);
    
    studentInfoService.getCommonStudents(teacherParam).then((value) => {
        res.status(Utils.getStatusCodeBasedOnResponse(value)).send(JSON.stringify(value));
    }).catch((err) => {
        logger.error("Error occur " + err);
        res.status(500).send(new ApiErrResponse('System Error'));
        return;
    });
});

router.post('/retrievefornotifications', validate(inputReqSchema.getNotifiedStudentSchema), (req, res) => {
    var teacherEmail = req.body.teacher;

    logger.info('Triggering retrieve notified student with teacher email : ' + teacherEmail + ' Notification message : ' + req.body.notification);
    
    if (Utils.validateEmailAddress(teacherEmail) == false) {
        logger.error('Invalid teacher email ' + teacherEmail);
        res.status(400).send(JSON.stringify(new ApiErrResponse('Teacher email is invalid')));
        return;
    }
    studentInfoService.getNotificationStudents(teacherEmail, req.body.notification).then((value) => {
        res.status(200).send(JSON.stringify(value));
        return;
    }).catch((err) => {
        logger.error('Error occur in retrieve notification student : ' + err);
        res.status(500).send(new ApiErrResponse('System Error'));
        return;
    });
});

router.use((err, req, res, next) => {
    logger.error('Error occur in router layer ' + err);
    if (err instanceof ValidationError) {
        res.status(422).send(JSON.stringify(new ApiErrResponse('Invalid input requst')));
    } else {
        next();
    }
});







module.exports = router;