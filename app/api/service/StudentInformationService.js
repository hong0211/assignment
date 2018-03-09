const CommonResponse = require('../model/CommonStudentInfoRes');
const ApiErrResponse = require('../model/ApiErrorResponse');
const NotificationResponse = require('../model/NotificationsResponse');
const DataAccess = require('../dataAccess/dataAccess');
const Utils = require('../util/commonUtils');
const logger = require('../config/loggingConfig');

var StudentInformationService = {
    getCommonStudents: async function getCommonStudentApi(teacherId) {
        if (teacherId == null) {
            logger.error('Teacher cannot be empty.');
            return new ApiErrResponse('Teacher cannot be empty.');
        }
    
        if (Array.isArray(teacherId) == false) {
    
            if (Utils.validateEmailAddress(teacherId) == false) {
                logger.error('Invalid email : ' + teacherId);
                return new ApiErrResponse('Invalid email : ' + teacherId);
            }
    
            var studentResult = await DataAccess.getStudents(teacherId);
            if (Utils.checkIsDbEmptyResults(studentResult)) {
                logger.error('No Student Found for teacherEmail ' + teacherId);
                return new ApiErrResponse('No Student Found for teacherEmail ' + teacherId);
            }
            return new CommonResponse(Utils.constructEmailOnlyArray(studentResult));
    
        } else {

            if (teacherId.length == 0) {
                logger.error("No teacher email in request.");
                return new ApiErrResponse("No teacher email found in request.");
            }

            for (var i = 0; i < teacherId.length; i += 1) {
                if (Utils.validateEmailAddress(teacherId[i]) == false) {
                    logger.error('Invalid teacher email ' + teacherId[i]);
                    return new ApiErrResponse('Invalid teacher email ' + teacherId[i]);
                }
            }
            var commonStudentResults = await DataAccess.getCommonStudent(teacherId, teacherId.length);
    
            if (Utils.checkIsDbEmptyResults(commonStudentResults)) {
                logger.error('No common student found.');
                return new ApiErrResponse('No Student Found');
            }
            return new CommonResponse(Utils.constructEmailOnlyArray(commonStudentResults));
    
        }
    
    },
    getNotificationStudents: async function validateGetNotifiedStudentReq(teacherEmail, notificationMsg) {
        var teacherRecord = await DataAccess.checkTeacher(teacherEmail);
        var notificationRecipients = [];
        if (Utils.checkIsDbEmptyResults(teacherRecord)) {
            logger.error('teacher not exist teacher email : ' + teacherEmail);
            return new ApiErrResponse('Teacher not exist teacher email : ' + teacherEmail);
        }
    
        var regex = /\S+[a-z0-9]@[a-z0-9\.]+/img;
        var notificationMentionEmail = notificationMsg.match(regex);
        if (notificationMentionEmail == null) {
            logger.info('No email is mentioned in notification message');
        } else {
            logger.info('Mentioned email : ' + notificationMentionEmail);
            var mentionedEmailToSearch = [];
            for (var i = 0; i < notificationMentionEmail.length; i += 1) {
                if (notificationMentionEmail[i].startsWith('@')) {
                    var mentionedEmail = notificationMentionEmail[i].substring(1, notificationMentionEmail[i].length);
                    if (Utils.validateEmailAddress(mentionedEmail) == false) {
                        logger.error('Email mentioned is invalid ' + mentionedEmail);
                        return new ApiErrResponse('Email mentioned is invalid ' + mentionedEmail);
                    } else {
                        mentionedEmailToSearch.push(mentionedEmail);
                    }
                }
            }
            var existingStudentsResult = await DataAccess.checkExistingStudents(mentionedEmailToSearch);
    
            if (Utils.checkIsDbEmptyResults(existingStudentsResult)) {
                logger.error('No Student found for mentioned email');
                return new ApiErrResponse('No Student found for mentioned email in notification');
            }
    
            notificationRecipients = Utils.constructEmailOnlyArray(existingStudentsResult);
            for (var i = 0; i < mentionedEmailToSearch.length; i += 1) {
                if (notificationRecipients.indexOf(mentionedEmailToSearch[i]) == -1) {
                    logger.error('Student ' + mentionedEmailToSearch[i] + ' not exist.');
                    return new ApiErrResponse('Student ' + mentionedEmailToSearch[i] + ' not exist.');
                }
            }
    
            for (var i = 0; i < existingStudentsResult.length; i += 1) {
                if (existingStudentsResult[i].STATUS == 1) {
                    logger.error('Student ' + existingStudentsResult[i].EMAIL + ' is suspended.');
                    return new ApiErrResponse('Student ' + existingStudentsResult[i].EMAIL + ' is suspended.');
                }
            }
        }
    
        var teacherExistingStudent = await DataAccess.getStudents(teacherEmail, true);
    
        if (Utils.checkIsDbEmptyResults(teacherExistingStudent)) {
            logger.info('No registered status student found for teacher ' + teacherEmail);
        } else {
            teacherExistingStudent.forEach((element) => {
                if (notificationRecipients.indexOf(element.EMAIL) == -1) {
                    notificationRecipients.push(element.EMAIL);
                }
            });
        }
        if (notificationRecipients.length == 0) {
            logger.error('No registered student to receive notification for teacher ' + teacherEmail);
            return new ApiErrResponse('No registered student to receive notification for teacher ' + teacherEmail);
        }
        return new NotificationResponse(notificationRecipients);
    }
}

module.exports = StudentInformationService;