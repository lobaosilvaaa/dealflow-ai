const swaggerJsdoc =
    require("swagger-jsdoc");

const swaggerSpec =
    swaggerJsdoc({

        definition: {

            openapi: "3.0.0",

            info: {

                title:
                    "DealFlow AI API",

                version:
                    "1.0.0",

                description:
                    `
                    API oficial da plataforma DealFlow AI.

                    Plataforma SaaS para automação de promoções,
                    analytics realtime e observabilidade.

                    Recursos:
                    - JWT Authentication
                    - Dashboard Realtime
                    - WebSockets
                    - Analytics Live
                    - Logs Distribuídos
                    `,

                contact: {

                    name:
                        "DealFlow AI",

                    url:
                        "https://dealflow.ai",

                    email:
                        "admin@dealflow.ai"

                },

                license: {

                    name:
                        "MIT"

                }

            },

            servers: [

                {

                    url:
                        "http://localhost:3000",

                    description:
                        "Servidor local DEV"

                }

            ],

            tags: [

                {

                    name:
                        "DealFlow API",

                    description:
                        "Endpoints principais da plataforma"

                }

            ],

            components: {

                securitySchemes: {

                    bearerAuth: {

                        type: "http",

                        scheme: "bearer",

                        bearerFormat: "JWT"

                    }

                }

            },

            security: [

                {

                    bearerAuth: []

                }

            ]

        },

        apis: [

            "./src/routes/*.js"

        ],

    });

module.exports =
    swaggerSpec;