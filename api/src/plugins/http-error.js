const fp = require('fastify-plugin');

const { PluginNames } = require('../enums/plugins');

const { BadRequest, NotFound, Forbidden, InternalServerError } = require('http-errors');

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

    return map.get(code) ?? new InternalServerError();
};

const plugin = (server, _, done) => {
    server.log.info(`Registering ${PluginNames.HTTP_ERROR} plugin...`);

    server.decorate('toHttpError', error => errorMapper(error));

    done();
};

const options = { name: PluginNames.HTTP_ERROR };

module.exports = fp(plugin, options);
