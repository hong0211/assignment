function ApiErrorResponse (message) {
    this.message = message;
    this.status = 'Failed';
}

module.exports = ApiErrorResponse;