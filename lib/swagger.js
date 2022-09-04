const swaggerJsDocs = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


module.exports = () => {


    const swaggerDocs = swaggerJsDocs({
        swaggerDefinition: {
            info: {
                title: process.env.ENV_SWAGTITLE,
                description: process.env.ENV_SWAGDESC,
                servers: [
                    `http://${process.env.ENV_APPDOM}:${process.env.ENV_APPPORT}`
                ]
            }
        },
        // apis: ["./server/route/api.js"]
        apis: ["./route.js"]
    })

    return [swaggerUi, swaggerDocs];

}


