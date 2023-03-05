const S = require('fluent-json-schema');

const headers = S.object().prop('authorization', S.string()).required(['authorization']);

module.exports = { headers };
