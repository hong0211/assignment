var expect = require('chai').expect;
var chai = require('chai');
const registrationService = require('../api/service/RegistrationService');
const studentInfoService = require('../api/service/StudentInformationService');
const ApiErrResponse = require('../api/model/ApiErrorResponse');
chai.use(require('chai-string'));

describe('App', function() {
    it('Negative Case passed for register student', async () => {
        var expectedMessage1 = "Invalid teacher email found ";
        var expectedMessage2 = "No teacher found for email : ";
        var expectedMessage3 = "Invalid or No student in input";
        var expectedMessage4 = "Invalid student email ";
        var expectedMessage5 = "Student not exist";
        var expectedMessage6 = "Student is suspended ";
        var expectedMessage7 = "is already registered to the teacher";
        const usecase1 = await registrationService.registerStudent('',[]);
        const usecase2 = await registrationService.registerStudent('a@gmail.com',[]);
        const usecase3 = await registrationService.registerStudent('TEACHER1@hotmail.com',213);
        const usecase4 = await registrationService.registerStudent('TEACHER1@hotmail.com',['studemailcom']);
        const usecase5 = await registrationService.registerStudent('TEACHER1@hotmail.com',['stude@mail.com']);
        const usecase6 = await registrationService.registerStudent('TEACHER1@hotmail.com',['TEST2@gmail.com']);
        const usecase7 = await registrationService.registerStudent('TEACHER1@hotmail.com',['TEST3@gmail.com']);

        expect(usecase1.message).to.equal(expectedMessage1);
        expect(usecase2.message).to.startsWith(expectedMessage2);
        expect(usecase3.message).to.equal(expectedMessage3);
        expect(usecase4.message).to.startsWith(expectedMessage4);
        expect(usecase5.message).to.startsWith(expectedMessage5);
        expect(usecase6.message).to.startsWith(expectedMessage6);
        expect(usecase7.message).to.contains(expectedMessage7);
    });

    it('Negative case passed for suspend student', async () =>  {
        var expectedMessage1 = "Student not exist";
        var expectedMessage2 = "Student is already suspended";
        const usecase1 = await registrationService.suspendStudent(123);
        const usecase2 = await registrationService.suspendStudent("TEST2@gmail.com");
        expect(usecase1.message).to.equal(expectedMessage1);
        expect(usecase2.message).to.equal(expectedMessage2);

    });

    it('Negative case passed for get common student', async () => {
        var expectedMessage1 = "Teacher cannot be empty.";
        var expectedMessage2 = "Invalid email : ";
        var expectedMessage3 = "No Student Found for teacherEmail ";
        var expectedMessage4 = "No teacher email found in request.";
        var expectedMessage5 = "Invalid teacher email ";
        var expectedMessage6 = "No Student Found";
        const usecase1 = await studentInfoService.getCommonStudents(null);
        const usecase2 = await studentInfoService.getCommonStudents('qwe');
        const usecase3 = await studentInfoService.getCommonStudents('abc@hotmail.com');

        const usecase4 = await studentInfoService.getCommonStudents([]);
        const usecase5 = await studentInfoService.getCommonStudents(['aaa@gmail.com','asdasd']);
        const usecase6 = await studentInfoService.getCommonStudents(['111@gmail.com','bbb@gmail.com']);
        expect(usecase1.message).to.equal(expectedMessage1);
        expect(usecase2.message).to.startsWith(expectedMessage2);
        expect(usecase3.message).to.startsWith(expectedMessage3);
        expect(usecase4.message).to.equal(expectedMessage4);
        expect(usecase5.message).to.startsWith(expectedMessage5);
        expect(usecase6.message).to.equal(expectedMessage6);
    });

    it('Negative cases for get notification for student.', async () => {
        var expectedMessage1 = "Teacher not exist teacher email : ";
        var expectedMessage2 = "Email mentioned is invalid ";
        var expectedMessage3 = "No Student found for mentioned email in notification";
        var expectedMessage4 = " not exist.";
        var expectedMessage5 = " is suspended.";
        var expectedMessage6 = "No registered student to receive notification for teacher ";

        const usecase1 = await studentInfoService.getNotificationStudents('','');
        const usecase2 = await studentInfoService.getNotificationStudents('TEACHER1@hotmail.com','@asdasd@com');
        const usecase3 = await studentInfoService.getNotificationStudents('TEACHER1@hotmail.com','@t123st@hotmail.com');
        const usecase4 = await studentInfoService.getNotificationStudents('TEACHER1@hotmail.com', '@TEST@gmail.com @ASD@DSA.COM');
        const usecase5 = await studentInfoService.getNotificationStudents('TEACHER1@hotmail.com', '@TEST2@gmail.com');
        const usecase6 = await studentInfoService.getNotificationStudents('TEACHER3@hotmail.com', 'qwe');
    
        expect(usecase1.message).to.startsWith(expectedMessage1);
        expect(usecase2.message).to.startsWith(expectedMessage2);
        expect(usecase3.message).to.startsWith(expectedMessage3);
        expect(usecase4.message).to.contains(expectedMessage4);
        expect(usecase5.message).to.contains(expectedMessage5);
        expect(usecase6.message).to.startsWith(expectedMessage6);
    });
});