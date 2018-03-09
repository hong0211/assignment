function ApiRequestSchema () {
    this.suspendStudentSchema = suspendStudentSchema;
    this.getNotifiedStudentSchema = getNotifiedStudentSchema;
    this.registerStudentSchema = registerStudentSchema;
}

const suspendStudentSchema = {
    properties: {
        student: { type: 'string'}
    },
    required: ['student']
};

const getNotifiedStudentSchema = {
    properties: {
        teacher: {type: 'string'},
        notification: {type: 'string'}
    },
    required: ['teacher','notification']
};

const registerStudentSchema = {
    properties: {
        teacher: {type: 'string'},
        students: {type: 'array', items: {type: 'string'}}
    },
    required: ['teacher','students']
}
module.exports = ApiRequestSchema;

