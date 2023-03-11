const { ErrorCodesKeys } = require('../enums/error-codes');

const ErrorMessages = new Map();

ErrorMessages.set(ErrorCodesKeys.EXPIRED_TOKEN, 'Expired token');

ErrorMessages.set(ErrorCodesKeys.USER_NOT_FOUND, 'User not found');

ErrorMessages.set(ErrorCodesKeys.INVALID_EMAIL, 'Invalid email address');

ErrorMessages.set(ErrorCodesKeys.EMAIL_EXISTS, 'Email address already exists');

ErrorMessages.set(ErrorCodesKeys.FIELD_NOT_EXIST, field =>
    field ? `${field} does not exist` : null
);

ErrorMessages.set(ErrorCodesKeys.FIELD_VALUE_EXISTS, field => `'${field}' value already exists`);

ErrorMessages.set(ErrorCodesKeys.MISSING_TOKEN, 'Missing authorization token');
ErrorMessages.set(ErrorCodesKeys.INVALID_TOKEN, 'Invalid authorization token');
ErrorMessages.set(ErrorCodesKeys.MISSING_ROLES, 'No roles to validate');
ErrorMessages.set(ErrorCodesKeys.NOT_AUTHORIZED, 'Role not authorized');

module.exports = { ErrorMessages };
