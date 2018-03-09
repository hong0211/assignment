const ApiErrResponse = require('../model/ApiErrorResponse');
const DataAccess = require('../dataAccess/dataAccess');
const Utils = require('../util/commonUtils');
const logger = require('../config/loggingConfig');

var RegistrationSerivce = {
    registerStudent: async function registerStudentImpl(teacherEmail, students) {
        if (Utils.validateEmailAddress(teacherEmail) == false) {
            logger.error('Invalid teacher email found ' + teacherEmail);
            return new ApiErrResponse('Invalid teacher email found ' + teacherEmail);
        }
    
        var teacherRecord = await DataAccess.checkTeacher(teacherEmail);
    
        if (Utils.checkIsDbEmptyResults(teacherRecord)) {
            logger.error('No teacher found for email : ' + teacherEmail);
            return new ApiErrResponse('No teacher found for email : ' + teacherEmail);
        }
    
        if (students.length == 0 || Array.isArray(students) == false) {
            logger.error('Invalid or No student in input');
            return new ApiErrResponse('Invalid or No student in input');
        }
        var studentForRegister = [];
        for (var i = 0; i < students.length; i += 1) {
            if (Utils.validateEmailAddress(students[i]) == false) {
                logger.error('Invalid student email' + students[i]);
                return new ApiErrResponse('Invalid student email ' + students[i]);
            }
            
            var existingStudent = await DataAccess.checkStudent(students[i]);
    
            if (Utils.checkIsDbEmptyResults(existingStudent)) {
                logger.error('Student not exist' + students[i]);
                return new ApiErrResponse('Student not exist ' + students[i]);
            } 
    
            if (existingStudent[0].STATUS == 1) {
                logger.error('Student is suspended' + students[i]);
                return new ApiErrResponse('Student is suspended ' + students[i]);
            }
    
            var registeredStudentRecord = await DataAccess.queryRegisteredStudent(teacherRecord[0].ID,existingStudent[0].ID);
    
            if (Utils.checkIsDbEmptyResults(registeredStudentRecord) == false) {
                logger.error('Students is registered');
                return new ApiErrResponse('Students '+ students[i] +' is already registered to the teacher '+ teacherEmail);
            }
           
            var teacherStudentRecord = [teacherRecord[0].ID,existingStudent[0].ID];
            
            studentForRegister.push(teacherStudentRecord);
        }
    
        return await DataAccess.insertTeacherStudent(studentForRegister);
    },
    suspendStudent: async function checkStudentStatus(studentEmail) {
        var studentExistResult = await DataAccess.checkStudent(studentEmail);
        if (Utils.checkIsDbEmptyResults(studentExistResult)) {
            logger.error('student not exist');
            return new ApiErrResponse('Student not exist');
        }
    
        for (var i = 0; i < studentExistResult.length; i += 1) {
            if (studentExistResult[i].STATUS == 1) {
                logger.error('Suspended status found');
                return new ApiErrResponse('Student is already suspended');
            }
        }
    
    
        return await DataAccess.suspendStudent(studentEmail);
    }
}

module.exports = RegistrationSerivce;