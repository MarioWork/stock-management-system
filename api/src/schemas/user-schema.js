const S = require('fluent-json-schema');

const UserSchema = S.object()
    .prop('uid', S.string())
    .prop('name', S.string())
    .prop('email', S.string())
    .prop('roles', S.array().items(S.string()))
    .required(['uid', 'name', 'email', 'roles']);

module.exports = UserSchema;
