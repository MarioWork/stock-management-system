const S = require('fluent-json-schema');

const { UserRoles } = require('../enums/user-roles');

const { fileSchema } = require('../schemas/file-schema');

const userIdSchema = S.string();

const userFirstNameSchema = S.string().minLength(2).maxLength(25);

const userLastNameSchema = S.string().minLength(2).maxLength(25);

const userNifSchema = S.string().minLength(9).maxLength(9);

const userProfilePictureSchema = fileSchema;

const userEmailSchema = S.string().format('email');

const userPasswordSchema = S.string().minLength(8);

const userCreatedAtSchema = S.string().format('date-time');

const userUpdatedAtSchema = S.string().format('date-time');

const userRolesSchema = S.array().items(S.string().enum(Object.values(UserRoles)));

const userSchema = S.object()
    .prop('id', userIdSchema)
    .prop('firstName', userFirstNameSchema)
    .prop('lastName', userLastNameSchema)
    .prop('nif', userNifSchema)
    .prop('profilePicture', S.oneOf([userProfilePictureSchema, S.null()]))
    .prop('email', userEmailSchema)
    .prop('createdAt', userCreatedAtSchema)
    .prop('updatedAt', userUpdatedAtSchema)
    .prop('roles', userRolesSchema)
    .prop('createdBy', this.userSchema)
    .required(['id']);

module.exports = {
    userIdSchema,
    userFirstNameSchema,
    userLastNameSchema,
    userNifSchema,
    userProfilePictureSchema,
    userEmailSchema,
    userCreatedAtSchema,
    userUpdatedAtSchema,
    userRolesSchema,
    userPasswordSchema,
    userSchema
};
