const S = require('fluent-json-schema');

const UserSchema = S.object()
    .prop('id', S.string())
    .prop('firstName', S.string())
    .prop('lastName', S.string())
    .prop('nif', S.string().minLength(9))
    .prop('profilePicture', S.object())
    .prop('email', S.string())
    .prop('createdAt', S.string().format('time'))
    .prop('updatedAt', S.string().format('time'))
    .prop('roles', S.array().items(S.string()))
    .required(['id', 'email', 'roles', 'firstName', 'lastName', 'nif', 'profilePicture']);

module.exports = UserSchema;
