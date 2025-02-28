import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Express avec Swagger",
            version: "1.0.0",
            description: "Documentation API générée avec Swagger",
        },
    },
    apis: ["./index.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);

export { specs, swaggerUi };

