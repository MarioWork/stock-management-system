const productSchema = require('../../schemas/product-schema');
const { createProduct } = require('../../controllers/product-controller');

const schema = {
    response: {
        201: productSchema
    }
};

const options = { schema };

module.exports = async server => {
    const { prisma, saveFile, to } = server;

    server.post('/', options, async (request, reply) => {
        const data = await request.file();

        const { name, quantity, categories } = data.fields;

        const categoriesArray = categories?.value.split(',').map(el => ({ id: parseInt(el) }));

        const [error, product] = await to(
            createProduct(
                { prisma, saveFile },
                {
                    name: name.value,
                    quantity: quantity?.value,
                    categories: categoriesArray,
                    imageFile: data.file,
                    imageName: data.filename
                }
            )
        );

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(201).send(product);
    });
};
