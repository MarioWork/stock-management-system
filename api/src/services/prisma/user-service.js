const getUser = (prisma, id) => {
    return prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            roles: true
        }
    });
};

const createUser = (prisma, { id, roles }) => {
    return prisma.user.create({
        data: {
            id,
            roles
        },
        select: {
            id: true,
            roles: true
        }
    });
};

module.exports = {
    getUser,
    createUser
};
