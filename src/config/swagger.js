// 🚀 DealFlowAI Swagger Configuration

const swaggerJsdoc =
    require("swagger-jsdoc");

// 🌎 Ambiente
const PORT =
    process.env.PORT || 3000;

const HOST =
    process.env.APP_URL ||
    `http://localhost:${PORT}`;

// 📚 Swagger Spec
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
# 🚀 DealFlow AI API

Plataforma SaaS para automação inteligente de promoções, analytics realtime e observabilidade distribuída.

## 🔥 Recursos

- JWT Authentication
- Dashboard Realtime
- Socket.IO
- WebSockets
- Live Metrics
- Runtime Monitoring
- Distributed Logs
- Swagger/OpenAPI
- Telegram Automation

## 🔐 Segurança

Todas as rotas protegidas utilizam:

- Bearer Token
- JWT Authentication
- Middleware Authorization

## 📡 Observabilidade

A plataforma possui:

- Runtime Logs
- Discord Webhooks
- Live Monitoring
- Error Tracking
- Healthcheck
- Realtime Analytics
                    `,

                termsOfService:
                    "https://dealflow.ai/terms",

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
                        "MIT",

                    url:
                        "https://opensource.org/licenses/MIT"

                }

            },

            servers: [

                {

                    url:
                        HOST,

                    description:
                        "Servidor Atual"

                },

                {

                    url:
                        "http://localhost:3000",

                    description:
                        "Servidor Local DEV"

                }

            ],

            tags: [

                {

                    name:
                        "Authentication",

                    description:
                        "Endpoints de autenticação"

                },

                {

                    name:
                        "DealFlow API",

                    description:
                        "Endpoints principais da plataforma"

                },

                {

                    name:
                        "Health",

                    description:
                        "Healthcheck e monitoramento"

                }

            ],

            components: {

                securitySchemes: {

                    bearerAuth: {

                        type: "http",

                        scheme: "bearer",

                        bearerFormat: "JWT",

                        description:
                            "Insira o token JWT no formato: Bearer TOKEN"

                    }

                },

                schemas: {

                    StatsResponse: {

                        type: "object",

                        properties: {

                            success: {

                                type: "boolean"

                            },

                            stats: {

                                type: "object",

                                properties: {

                                    sentPromos: {

                                        type: "integer",

                                        example: 120

                                    },

                                    totalUsers: {

                                        type: "integer",

                                        example: 25

                                    },

                                    uptime: {

                                        type: "integer",

                                        example: 3600

                                    }

                                }

                            }

                        }

                    },

                    UserResponse: {

                        type: "object",

                        properties: {

                            success: {

                                type: "boolean"

                            },

                            users: {

                                type: "array",

                                items: {

                                    type: "object",

                                    properties: {

                                        chat_id: {

                                            type: "string",

                                            example: "123456789"

                                        },

                                        category: {

                                            type: "string",

                                            example: "gamer"

                                        },

                                        frequency: {

                                            type: "integer",

                                            example: 60

                                        },

                                        active: {

                                            type: "integer",

                                            example: 1

                                        }

                                    }

                                }

                            }

                        }

                    },

                    LogsResponse: {

                        type: "object",

                        properties: {

                            success: {

                                type: "boolean"

                            },

                            logs: {

                                type: "array",

                                items: {

                                    type: "string"

                                }

                            }

                        }

                    },

                    ErrorResponse: {

                        type: "object",

                        properties: {

                            success: {

                                type: "boolean",

                                example: false

                            },

                            error: {

                                type: "string",

                                example: "Token inválido"

                            }

                        }

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

// 🚀 Exporta spec
module.exports =
    swaggerSpec;