const swaggerJsdoc =
    require("swagger-jsdoc");

const swaggerSpec =
    swaggerJsdoc({

        definition: {

            openapi: "3.0.0",

            info: {

                title:
                    "DealFlow AI API",

                version: "1.0.0",

                description:
                    "API oficial DealFlow AI",

            },

            servers: [

                {
                    url:
                        "http://localhost:3000"
                }

            ],

        },

        apis: [
            "./src/routes/*.js"
        ],

    });

module.exports =
    swaggerSpec;