const ErrorCodesKeys = {
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INVALID_EMAIL: 'INVALID_EMAIL',
    EMAIL_EXISTS: 'EMAIL_EXISTS',
    FIELD_NOT_EXIST: 'FIELD_NOT_EXIST',
    FIELD_VALUE_EXISTS: 'FIELD_VALUE_EXISTS',
    NOT_FOUND: 'NOT_FOUND',
    MISSING_TOKEN: 'MISSING_TOKEN',
    INVALID_TOKEN: 'INVALID_TOKEN',
    MISSING_ROLES: 'MISSING_ROLES',
    NOT_AUTHORIZED: 'NOT_AUTHORIZED',
    INVALID_SORTING_FIELD: 'INVALID_SORTING_FIELD'
};

const ErrorCodes = new Map();

//Firebase
ErrorCodes.set(ErrorCodesKeys.EXPIRED_TOKEN, 'auth/id-token-expired');

ErrorCodes.set(ErrorCodesKeys.USER_NOT_FOUND, 'auth/user-not-found');

ErrorCodes.set(ErrorCodesKeys.INVALID_EMAIL, 'auth/invalid-email');

ErrorCodes.set(ErrorCodesKeys.EMAIL_EXISTS, 'auth/email-already-exists');

ErrorCodes.set(ErrorCodesKeys.INVALID_TOKEN, 'auth/argument-error');

//Prisma
ErrorCodes.set(ErrorCodesKeys.FIELD_NOT_EXIST, 'P2025');
ErrorCodes.set(ErrorCodesKeys.FIELD_VALUE_EXISTS, 'P2002');
ErrorCodes.set(ErrorCodesKeys.NOT_FOUND, 'P2016');

module.exports = { ErrorCodes, ErrorCodesKeys };
