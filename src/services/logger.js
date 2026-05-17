// 🚀 DealFlowAI Logger Service

const winston =
    require("winston");

const axios =
    require("axios");

const fs =
    require("fs");

const path =
    require("path");

// 📂 Diretório logs
const logsDir =
    path.join(
        __dirname,
        "../logs"
    );

// 📂 Cria diretório logs
if (

    !fs.existsSync(logsDir)

) {

    fs.mkdirSync(

        logsDir,

        {

            recursive: true

        }

    );

}

// 📄 Arquivo log
const logFile =
    path.join(
        logsDir,
        "app.log"
    );

// 🔌 Socket.IO
let io = null;

// 🔗 Vincula socket
function setSocket(serverIo) {

    io = serverIo;

}

// 🎨 Cor Discord
function getDiscordColor(level) {

    switch (level) {

        case "error":
            return 15158332;

        case "warn":
            return 16776960;

        case "success":
            return 5763719;

        default:
            return 3447003;

    }

}

// 📊 Status Discord
function getDiscordStatus(level) {

    switch (level) {

        case "error":
            return "🔴 Error";

        case "warn":
            return "🟡 Warning";

        case "success":
            return "🟢 Success";

        default:
            return "🔵 Info";

    }

}

// 🚀 Logger principal
const logger =
    winston.createLogger({

        level: "info",

        format:
            winston.format.combine(

                winston.format.timestamp({

                    format:
                        "YYYY-MM-DD HH:mm:ss"

                }),

                winston.format.errors({

                    stack: true

                }),

                winston.format.printf(({

                    timestamp,
                    level,
                    message

                }) => {

                    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;

                })

            ),

        transports: [

            // 📄 Arquivo
            new winston.transports.File({

                filename:
                    logFile,

                maxsize:
                    5 * 1024 * 1024,

                maxFiles: 5,

            }),

            // 🖥️ Console
            new winston.transports.Console({

                format:
                    winston.format.combine(

                        winston.format.colorize(),

                        winston.format.printf(({

                            timestamp,
                            level,
                            message

                        }) => {

                            return `[${timestamp}] ${level}: ${message}`;

                        })

                    )

            })

        ]

    });

// 📡 Realtime dashboard
function emitRealtimeLog(

    level,
    message

) {

    try {

        if (!io) {

            return;

        }

        io.emit(

            "new-log",

            {

                level,

                message,

                timestamp:
                    new Date()
                        .toLocaleTimeString(),

            }

        );

    } catch (error) {

        console.log(
            "❌ Erro realtime log:",
            error.message
        );

    }

}

// 📢 Runtime logs Discord
async function sendRuntimeLog(

    title,
    message,
    level = "info"

) {

    try {

        // 🛡️ Webhook obrigatório
        if (

            !process.env.DISCORD_WEBHOOK_URL

        ) {

            logger.warn(
                "Webhook Discord ausente"
            );

            return;

        }

        // 📊 Memória
        const memoryUsage =
            Math.round(

                process.memoryUsage().rss
                / 1024
                / 1024

            );

        // 📦 Payload Discord
        const payload = {

            username:
                "DealFlowAI Runtime",

            avatar_url:
                "https://raw.githubusercontent.com/lobaosilvaaa/dealflow-ai/main/src/assets/LogoDealFlowAI.png",

            embeds: [{

                title,

                description:
                    message,

                color:
                    getDiscordColor(level),

                fields: [

                    {

                        name:
                            "📌 Status",

                        value:
                            getDiscordStatus(level),

                        inline: true

                    },

                    {

                        name:
                            "⚙️ Service",

                        value:
                            "dealflow-api",

                        inline: true

                    },

                    {

                        name:
                            "🖥️ Environment",

                        value:

                            process.env.NODE_ENV ||
                            "development",

                        inline: true

                    },

                    {

                        name:
                            "💾 Performance",

                        value:
                            `${memoryUsage} MB`,

                        inline: true

                    },

                    {

                        name:
                            "⏱️ Runtime",

                        value:
                            `${Math.floor(process.uptime())}s`,

                        inline: true

                    },

                    {

                        name:
                            "🟢 Node",

                        value:
                            process.version,

                        inline: true

                    }

                ],

                footer: {

                    text:
                        "DealFlow AI Runtime Logs"

                },

                timestamp:
                    new Date()

            }]

        };

        // 🚀 Envia webhook
        await axios.post(

            process.env.DISCORD_WEBHOOK_URL,

            payload

        );

    } catch (error) {

        console.log(

            "❌ Erro webhook Discord:",

            error.message

        );

    }

}

// 📡 Override INFO
const originalInfo =
    logger.info.bind(logger);

logger.info = (message) => {

    originalInfo(message);

    emitRealtimeLog(
        "info",
        message
    );

};

// ⚠️ Override WARN
const originalWarn =
    logger.warn.bind(logger);

logger.warn = (message) => {

    originalWarn(message);

    emitRealtimeLog(
        "warn",
        message
    );

};

// ❌ Override ERROR
const originalError =
    logger.error.bind(logger);

logger.error = (message) => {

    originalError(message);

    emitRealtimeLog(
        "error",
        message
    );

};

module.exports = {

    logger,

    setSocket,

    sendRuntimeLog,

};