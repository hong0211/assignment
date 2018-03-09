const express = require('express');
const router = express.Router();
const ApiErrResponse = require('../model/ApiErrorResponse');

const { validate, ValidationError } = require('express-json-validator');
const Utils = require('../util/commonUtils');
const ApiRequestSchemas = require('../schema/ApiRequestSchema');
const registrationService = require('../service/RegistrationService');
const studentInfoService = require('../service/StudentInformationService');
const logger = require('../config/loggingConfig');
var inputReqSchema = new ApiRequestSchemas();


router.post('/register', validate(inputReqSchema.registerStudentSchema), (req, res) => {

    logger.info('Calling register student api with teacherEmail ' + req.body.teacher + ' Students : ' + req.body.students);

    registrationService.registerStudent(req.body.teacher,req.body.students).then((value) => {
        if (value instanceof ApiErrResponse == false) {
            if (value.affectedRows != req.body.students.length) {
                logger.error('Unable to insert all students');
                res.status(500).send(JSON.stringify(new ApiErrResponse('System Error.')));
            } else {
                res.status(204).json({status: 'Success', message: 'Students registered successfully.'});
            }
        } else {
            res.status(400).send(JSON.stringify(value));
        }
        
        return;
    }).catch((err) => {
        logger.error('Error occur when register new student ' + err);
        res.status(500).send(new ApiErrResponse('System Error'));
        return;
    });
});

router.post('/suspend', validate(inputReqSchema.suspendStudentSchema), (req, res) => {
    logger.info('Calling suspended student with student email ' + req.body.student);

    if (Utils.validateEmailAddress(req.body.student) == false) {
        logger.error('Invalid student email ' + req.body.student);
        res.status(422).send(new ApiErrResponse('Student Email is invalid'));
        return;
    }
    registrationService.suspendStudent(req.body.student).then((value) => {
        if (value instanceof ApiErrResponse) {
            res.status(400).send(JSON.stringify(value));
        } else {
            if (value.changedRows != 0) {
                res.status(200).json({ status: 'success', message: 'Student is suspended' });
                return;
            } else {
                logger.error('No Rows is updated');
                res.status(500).send(JSON.stringify(new ApiErrResponse('System Error')));
            }
        }

        return;
    }).catch((err) => {
        logger.error('Error occur in suspend student ' + err);
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