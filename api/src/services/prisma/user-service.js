//TODO: Add docs
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

//TODO: Add docs
const createUser = (prisma, { id, role }) => {
    return prisma.user.create({
        data: {
            id,
            role
        },
        select: {
            id: true,
            role: true
        }
    });
};

module.exports = {
    getUser,
    createUser
};
