const db = require('../config/dbConnections');
const ApiErrResponse = require('../model/ApiErrorResponse');
const Utils = require('../util/commonUtils');
const logger = require('../config/loggingConfig');

const SELECT_ALL_STUDENT = 'SELECT * FROM student';
const SELECT_COMMON_STUDENT = 'SELECT S.EMAIL FROM teacher T JOIN teacher_student TS ON T.ID = TS.TEACHER_ID JOIN student S ON TS.STUDENT_ID = S.ID WHERE T.EMAIL IN (IN_PARAMS) GROUP BY TS.STUDENT_ID HAVING (COUNT(TS.STUDENT_ID) = ?)';
const SELECT_REGISTERED_STUDENT = 'SELECT S.EMAIL FROM teacher T JOIN teacher_student TS ON T.ID = TS.TEACHER_ID JOIN student S ON TS.STUDENT_ID = S.ID WHERE T.EMAIL = ?';
const SELECT_STUDENT_WITH_EMAIL =  'SELECT * FROM student WHERE EMAIL = ?';
const SUSPEND_STUDENT = 'UPDATE student SET STATUS = 1 WHERE EMAIL = ?';
const SELECT_TEACHER_WITH_EMAIL = 'SELECT * FROM teacher WHERE EMAIL = ?';
const CHECK_EXISTING_STUDENTS = 'SELECT * FROM student WHERE EMAIL IN (IN_PARAMS)';
const FILTER_ACTIVE_STATUS_FOR_STUDENT = " AND S.STATUS = 0";
const CHECK_IS_STUDENT_REGISTERED = 'SELECT * FROM teacher_student WHERE TEACHER_ID = ? AND STUDENT_ID = ?';
const REGISTER_STUDENT = 'INSERT INTO teacher_student (TEACHER_ID,STUDENT_ID) VALUES ?'


var DataAccess = {
    getCommonStudent: async function(teacherid,teacherCount) {
        return new Promise(function(resolve, reject) { 
            db.query(Utils.processInParamsForSqlStatements(SELECT_COMMON_STUDENT, teacherid), prepareGetCommonStudentsParams(teacherid,teacherCount) ,function(err,results,fields) {
                if(err) {
                    logger.error('Error in data access select common student ' + err);
                    reject(err);
                } else {
                    logger.debug('select common student param ' + teacherid + ' teacher count ' + teacherCount);
                    resolve(results);
                }
            });
        });
    },
    getStudents: async function(teacherEmail, isSearchForActiveOnly) {
        var sql = SELECT_REGISTERED_STUDENT;
        if (isSearchForActiveOnly == true) {
            sql += FILTER_ACTIVE_STATUS_FOR_STUDENT;
        }

        return new Promise(function(resolve, reject) {
            db.query(sql, [teacherEmail],function(err,results,fields) {
                if (err) {
                    logger.error('Error in data access select registered student ' + err);
                    reject(err);
                } else {
                    logger.debug('select registered student param ' + teacherEmail);
                    resolve(results);
                }
            });
        });
    },
    checkStudent: async function(studentEmail) {
        return new Promise(function(resolve,reject) {
            db.query(SELECT_STUDENT_WITH_EMAIL, [studentEmail], function(err,results,fields) {
                if (err) {
                    logger.error('Error in data access select student with email ' + err);
                    reject(err);
                } else {
                    logger.debug('select student email param ' + studentEmail);
                    resolve(results);
                }
            });
        });
    },
    suspendStudent: async function (studentEmail) {
        return new Promise(function(resolve,reject) {
            db.query(SUSPEND_STUDENT, [studentEmail], function(err, rows) {
                if (err) {
                    logger.error('Error in data access suspend student ' + err);
                    reject(err);
                } else {
                    logger.debug('Suspend student email ' + studentEmail);
                    resolve(rows);
                }
            });
        });
    },
    checkTeacher: async function(teacherEmail) {
        return new Promise(function(resolve, reject) {
            db.query(SELECT_TEACHER_WITH_EMAIL, [teacherEmail], function(err,results) {
                if (err) {
                    logger.error('Error in data access select teacher ' + err);
                    reject(err);
                } else {
                    logger.debug('Select teacher param ' + teacherEmail);
                    resolve(results);
                }
            });
        });
    },
    checkExistingStudents: async function(studentsEmail) {
        return new Promise(function(resolve,reject) {
            db.query(Utils.processInParamsForSqlStatements(CHECK_EXISTING_STUDENTS,studentsEmail),Utils.populateInParams(studentsEmail), function(err,results) {
                if (err) {
                    logger.error('Error in data access select students ' + err);
                    reject(err);
                } else {
                    logger.debug('select students param ' + studentsEmail);
                    resolve(results);
                }
            });
        });
    },
    insertTeacherStudent: async function(teacherStudentRecords) {
        return new Promise(function(resolve,reject) {
           db.query(REGISTER_STUDENT, [teacherStudentRecords], function (err,results) {
                if (err) {
                    logger.error('Error in data access register student ' + err);
                    reject(err);
                } else {
                    logger.debug('Register student param ' +teacherStudentRecords);
                    resolve(results);
                }
           }); 
        });
    },
    queryRegisteredStudent: async function(teacherId, studentId) {
        return new Promise(function(resolve, reject) {
            db.query(CHECK_IS_STUDENT_REGISTERED,[teacherId,studentId],function(err, results) {
                if (err) {
                    logger.error('Error in data access check is registered student ' + err);
                    reject(err);
                } else {
                    logger.debug('check is registered student params ' + teacherId + ' ' +studentId);
                    resolve(results);
                }
            });
        });
    }
}

function prepareGetCommonStudentsParams (teacherid, teacherCount) {
    var inputParams = [];
    inputParams = Utils.populateInParams(teacherid);
    inputParams.push(teacherCount);
    return inputParams;
}

module.exports = DataAccess;