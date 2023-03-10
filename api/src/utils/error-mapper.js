const { BadRequest, NotFound, Forbidden, InternalServerError } = require('http-errors');

const getFieldsFromError = error => error?.meta?.cause ?? error?.meta?.target;

const errorMapper = error => {
    const code = error?.code ?? error?.statusCode;
    const message = error.message;

    const map = new Map();

    map.set(400, new BadRequest(message));
    map.set(403, new Forbidden(message));
    map.set(404, new NotFound(message));

    //Firebase
    map.set('auth/id-token-expired', new Forbidden('Expired Token'));
    map.set('auth/user-not-found', new NotFound('User not found'));
    map.set('auth/invalid-email', new BadRequest('Invalid Email'));
    map.set('auth/email-already-exists', new NotFound('Email already exists'));

    //Prisma
    map.set('P2025', new NotFound(`'${getFieldsFromError(error)}' does not exist`));
    map.set('P2002', new BadRequest(`'${getFieldsFromError(error)}' value already exist`));
    map.set('P2016', new NotFound());

    return map.get(code) ?? new InternalServerError();
};

module.exports = {
    errorMapper
};
