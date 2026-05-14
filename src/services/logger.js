const winston =
    require("winston");

// 🔌 Socket.IO
let io = null;

// 🔗 Vincula socket
function setSocket(serverIo) {

    io = serverIo;

}

// 🚀 Logger
const logger =
    winston.createLogger({

        level: "info",

        format:
            winston.format.combine(

                winston.format.timestamp(),

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

// 📡 Realtime logs
const originalInfo =
    logger.info.bind(logger);

logger.info = (message) => {

    originalInfo(message);

    if (io) {

        io.emit("new-log", {

            message,

            timestamp:
                new Date().toLocaleTimeString(),

        });

    }

};

module.exports = {

    logger,

    setSocket,

};