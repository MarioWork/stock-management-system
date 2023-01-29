//TODO: Move to service
const getFile = (prisma, id) => {
    return prisma.file.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            url: true,
            type: true
        }
    });
};

module.exports = {
    getFile
};
