const { BadRequest, NotFound, Forbidden, InternalServerError } = require('http-errors');

const { ErrorCodes, ErrorCodesKeys } = require('../enums/error-codes');
const { ErrorMessages } = require('../localization/error-messages');

const getFieldsFromError = error => error?.meta?.cause.match(/'(.*?)'/i)[0] ?? error?.meta?.target;

const errorMapper = error => {
    const code = error?.code ?? error?.statusCode;
    const message = error.message;

    const map = new Map();

    map.set(400, new BadRequest(message));
    map.set(403, new Forbidden(message));
    map.set(404, new NotFound(message));

    map.set(
        ErrorCodes.get(ErrorCodesKeys.EXPIRED_TOKEN),
        new Forbidden(ErrorMessages.get(ErrorCodesKeys.EXPIRED_TOKEN))
    );

    map.set(
        ErrorCodes.get(ErrorCodesKeys.USER_NOT_FOUND),
        new NotFound(ErrorMessages.get(ErrorCodesKeys.USER_NOT_FOUND))
    );

    map.set(
        ErrorCodesKeys.INVALID_EMAIL,
        new BadRequest(ErrorMessages.get(ErrorCodesKeys.INVALID_EMAIL))
    );

    map.set(
        ErrorCodes.get(ErrorCodesKeys.EMAIL_EXISTS),
        new BadRequest(ErrorMessages.get(ErrorCodesKeys.EMAIL_EXISTS))
    );

    map.set(
        ErrorCodes.get(ErrorCodesKeys.FIELD_NOT_EXIST),
        new NotFound(ErrorMessages.get(ErrorCodesKeys.FIELD_NOT_EXIST)(getFieldsFromError(error)))
    );

    map.set(
        ErrorCodes.get(ErrorCodesKeys.FIELD_VALUE_EXISTS),
        new BadRequest(
            ErrorMessages.get(ErrorCodesKeys.FIELD_VALUE_EXISTS)(getFieldsFromError(error))
        )
    );

    map.set(
        ErrorCodes.get(ErrorCodesKeys.INVALID_TOKEN),
        new Forbidden(ErrorMessages.get(ErrorCodesKeys.INVALID_TOKEN))
    );

    map.set(ErrorCodes.get(ErrorCodesKeys.NOT_FOUND), new NotFound());

    return map.get(code) ?? new InternalServerError();
};

module.exports = {
    errorMapper
};
