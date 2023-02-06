const S = require('fluent-json-schema');

const UserSchema = S.object()
    .prop('id', S.string())
    .prop('firstName', S.string())
    .prop('lastName', S.string())
    .prop('nif', S.string())
    .prop('profilePicture', S.string())
    .prop('email', S.string())
    .prop('roles', S.array().items(S.string()))
    .required(['id', 'name', 'email', 'roles', 'firstName', 'lastName', 'nif', 'profilePicture']);

module.exports = UserSchema;
