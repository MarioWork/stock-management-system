const S = require('fluent-json-schema');

const UserSchema = S.object()
    .prop('uid', S.string())
    .prop('name', S.string())
    .prop('email', S.string())
    .prop('role', S.string())
    .required(['uid', 'name', 'email', 'role']);

module.exports = UserSchema;
