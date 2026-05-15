const winston =
    require("winston");

const axios =
    require("axios");

// 🔌 Socket.IO
let io = null;

// 🔗 Vincula socket
function setSocket(serverIo) {

    io = serverIo;

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

                winston.format.printf(({

                    timestamp,
                    level,
                    message

                }) => {

                    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;

                })

            ),

        transports: [

            new winston.transports.File({

                filename:
                    "src/logs/app.log"

            }),

            new winston.transports.Console()

        ]

    });

// 📡 Realtime dashboard
function emitRealtimeLog(

    level,
    message

) {

    if (io) {

        io.emit("new-log", {

            level,

            message,

            timestamp:
                new Date().toLocaleTimeString(),

        });

    }

}

// 📢 Runtime logs Discord
async function sendRuntimeLog(

    title,
    message,
    level = "info"

) {

    if (

        !process.env.DISCORD_WEBHOOK_URL

    ) {

        return;

    }

    try {

        await axios.post(

            process.env.DISCORD_WEBHOOK_URL,

            {

                embeds: [{

                    title,

                    description:
                        message,

                    color:

                        level === "error"
                            ? 15158332

                            : level === "warn"
                                ? 16776960

                                : 3447003,

                    fields: [

                        {

                            name:
                                "📌 Status",

                            value:

                                level === "error"
                                    ? "🔴 Error"

                                    : level === "warn"
                                        ? "🟡 Warning"

                                        : "🟢 Operational",

                            inline: true

                        },

                        {

                            name:
                                "⚙️ Service",

                            value:
                                "telegram-bot",

                            inline: true

                        },

                        {

                            name:
                                "🖥️ Environment",

                            value:
                                "DEV",

                            inline: true

                        },

                        {

                            name:
                                "💾 Performance",

                            value:
                                `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,

                            inline: true

                        },

                        {

                            name:
                                "⏱️ Runtime",

                            value:
                                `${Math.floor(process.uptime())}s`,

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

            }

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