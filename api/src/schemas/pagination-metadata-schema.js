const S = require('fluent-json-schema');

const paginationMetadataSchema = S.object()
    .prop('currentPage', S.number())
    .prop('currentPageSize', S.number())
    .prop('firstPage', S.number())
    .prop('lastPage', S.number())
    .prop('pageSize', S.number())
    .prop('totalRecords', S.number())
    .required([
        'currentPage',
        'currentPageSize',
        'firstPage',
        'lastPage',
        'pageSize',
        'totalRecords'
    ]);

module.exports = paginationMetadataSchema;
