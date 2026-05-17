// 🚀 DealFlowAI Core Application

require("dotenv").config();

// 🚨 Segurança ENV
if (

    !process.env.TELEGRAM_BOT_TOKEN ||
    !process.env.SESSION_SECRET ||
    !process.env.JWT_SECRET

) {

    console.log(
        "❌ Variáveis .env ausentes"
    );

    process.exit(1);

}

const express =
    require("express");

const session =
    require("express-session");

const http =
    require("http");

const path =
    require("path");

const helmet =
    require("helmet");

const compression =
    require("compression");

const cors =
    require("cors");

const {
    Server,
} = require("socket.io");

// 📚 Swagger
const swaggerUi =
    require("swagger-ui-express");

const swaggerSpec =
    require("./src/config/swagger");

// 🔊 Logger
const {

    logger,
    setSocket,
    sendRuntimeLog,

} = require(
    "./src/services/logger"
);

// 📡 Live Metrics
const {

    startLiveMetrics,
    stopLiveMetrics

} = require(
    "./src/services/liveMetrics"
);

// 🤖 Telegram
const {

    startTelegramBot,
    bot,

} = require(
    "./src/adapters/telegram/telegram"
);

// ⏰ Scheduler
const {

    startScheduler,
    stopScheduler

} = require(
    "./src/services/scheduler"
);

// 🌐 Rotas
const authRoutes =
    require("./src/routes/authRoutes");

const dashboardRoutes =
    require("./src/routes/dashboardRoutes");

const adminRoutes =
    require("./src/routes/adminRoutes");

const apiRoutes =
    require("./src/routes/apiRoutes");

// 🚀 App
const app =
    express();

// 🌐 HTTP Server
const server =
    http.createServer(app);

// 🌎 Ambiente
const ENVIRONMENT =
    process.env.NODE_ENV ||
    "development";

// ⚙️ Porta
const PORT =
    process.env.PORT || 3000;

// 🔌 Socket.IO
const io =
    new Server(server, {

        cors: {

            origin: "*",

        },

    });

// 🔗 Socket no logger
setSocket(io);

// 🛡️ Helmet
app.use(
    helmet()
);

// 📦 Compression
app.use(
    compression()
);

// 🌐 CORS
app.use(cors());

// 📦 Body Parser
app.use(express.urlencoded({

    extended: true

}));

app.use(express.json({

    limit: "10mb"

}));

// 🌐 Arquivos estáticos
app.use(

    express.static(

        path.join(
            __dirname,
            "public"
        )

    )

);

// 🔐 Sessão
app.use(session({

    secret:
        process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {

        secure:
            ENVIRONMENT === "production",

        httpOnly: true,

        sameSite: "lax",

        maxAge:
            1000 * 60 * 60 * 24

    }

}));

// 🚀 EJS
app.set(
    "view engine",
    "ejs"
);

app.set(

    "views",

    path.join(
        __dirname,
        "src/views"
    )

);

// 📚 Swagger
app.use(

    "/api/docs",

    swaggerUi.serve,

    swaggerUi.setup(
        swaggerSpec
    )

);

// 📡 Live Metrics
startLiveMetrics(io);

// 🔌 Cliente realtime
io.on(

    "connection",

    socket => {

        logger.info(

            `Cliente realtime conectado: ${socket.id}`

        );

        socket.on(

            "disconnect",

            () => {

                logger.warn(

                    `Cliente realtime desconectado: ${socket.id}`

                );

            }

        );

    }

);

// 🌐 Rotas
app.use(authRoutes);

app.use(dashboardRoutes);

app.use(adminRoutes);

app.use(apiRoutes);

// 🏠 Home
app.get("/", (req, res) => {

    return res.json({

        success: true,

        service:
            "DealFlowAI",

        environment:
            ENVIRONMENT,

        status:
            "online",

        uptime:
            Math.floor(
                process.uptime()
            ),

    });

});

// ❤️ Healthcheck
app.get("/health", (req, res) => {

    return res.json({

        success: true,

        status:
            "healthy",

        environment:
            ENVIRONMENT,

        uptime:
            Math.floor(
                process.uptime()
            ),

        memory:
            Math.round(

                process.memoryUsage().rss
                / 1024
                / 1024

            ),

        timestamp:
            new Date(),

    });

});

// ❌ 404 Global
app.use((req, res) => {

    logger.warn(

        `Rota inexistente: ${req.originalUrl}`

    );

    return res.status(404).json({

        success: false,

        error:
            "Rota não encontrada"

    });

});

// ❌ Error Handler Global
app.use((

    error,
    req,
    res,
    next

) => {

    logger.error(
        error.stack ||
        error.message
    );

    return res.status(500).json({

        success: false,

        error:
            "Erro interno servidor"

    });

});

// 🚀 Inicializa servidor
server.listen(

    PORT,

    async () => {

        logger.info(

            `Servidor rodando na porta ${PORT}`

        );

        // 🤖 Telegram
        startTelegramBot();

        // ⏰ Scheduler
        startScheduler(bot);

        // 📡 Runtime
        await sendRuntimeLog(

            "🚀 Sistema Online",

            `DealFlow AI iniciado com sucesso.

🌎 Environment: ${ENVIRONMENT}
🚀 Port: ${PORT}
⚡ Status: Online`,

            "core",

            "healthy",

            "🚀 Startup"

        );

    }

);

// 🛑 Graceful Shutdown
async function gracefulShutdown(signal) {

    try {

        logger.warn(
            `Encerrando aplicação (${signal})`
        );

        // 📡 Runtime
        await sendRuntimeLog(

            "🛑 Sistema Offline",

            `DealFlow AI encerrado (${signal})`,

            "core",

            "offline",

            "🛑 Shutdown"

        );

        // 🛑 Serviços
        await stopScheduler();

        await stopLiveMetrics();

        // 🌐 Fecha server
        server.close(() => {

            logger.info(
                "Servidor HTTP encerrado"
            );

            process.exit(0);

        });

    } catch (error) {

        logger.error(
            `Erro shutdown: ${error.message}`
        );

        process.exit(1);

    }

}

// 🛑 Signals
process.on(

    "SIGINT",

    () => gracefulShutdown("SIGINT")

);

process.on(

    "SIGTERM",

    () => gracefulShutdown("SIGTERM")

);

// ❌ Exceções críticas
process.on(

    "uncaughtException",

    async error => {

        logger.error(

            `Uncaught Exception: ${error.message}`

        );

        await sendRuntimeLog(

            "❌ Uncaught Exception",

            error.stack ||
            error.message,

            "core",

            "error",

            "💥 Exceptions"

        );

    }

);

// ❌ Promises rejeitadas
process.on(

    "unhandledRejection",

    async error => {

        logger.error(

            `Unhandled Rejection: ${error}`

        );

        await sendRuntimeLog(

            "❌ Unhandled Rejection",

            String(error),

            "core",

            "error",

            "💥 Promises"

        );

    }

);