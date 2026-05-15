require("dotenv").config();

const express =
    require("express");

const session =
    require("express-session");

const http =
    require("http");

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

// 🔌 Socket.IO
const io =
    new Server(server, {

        cors: {

            origin: "*",

        },

    });

// 🔗 Socket no logger
setSocket(io);

// 📡 Inicializa métricas realtime
startLiveMetrics(io);

// 🔌 Cliente realtime conectado
io.on("connection", socket => {

    logger.info(
        `Cliente realtime conectado: ${socket.id}`
    );

    socket.on("disconnect", () => {

        logger.warn(
            `Cliente realtime desconectado: ${socket.id}`
        );

    });

});

// ⚙️ Configuração
const PORT =
    process.env.PORT || 3000;

// 🚀 EJS
app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    "./src/views"
);

// 📦 Middlewares
app.use(express.urlencoded({

    extended: true

}));

app.use(express.json());

// 🌐 Arquivos estáticos
app.use(
    express.static("public")
);

// 🔐 Sessão
app.use(session({

    secret:
        process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {

        secure: false,

        httpOnly: true,

        maxAge:
            1000 * 60 * 60 * 24

    }

}));

// 📚 Swagger
app.use(

    "/api/docs",

    swaggerUi.serve,

    swaggerUi.setup(
        swaggerSpec
    )

);

// 🌐 Rotas
app.use(authRoutes);

app.use(dashboardRoutes);

app.use(adminRoutes);

app.use(apiRoutes);

// 🏠 Home
app.get("/", (req, res) => {

    res.send(
        "🚀 DealFlow AI rodando"
    );

});

// ❤️ Healthcheck
app.get("/health", (req, res) => {

    res.json({

        success: true,

        status:
            "online",

        uptime:
            Math.floor(
                process.uptime()
            ),

        timestamp:
            new Date(),

        environment:
            process.env.NODE_ENV || "development",

    });

});

// 🚀 Inicializa servidor
server.listen(PORT, async () => {

    logger.info(
        `Servidor rodando na porta ${PORT}`
    );

    await sendRuntimeLog(

        "🚀 Sistema Online",

        "DealFlow AI iniciado com sucesso."

    );

});

// 🚀 Bootstrap principal
async function bootstrap() {

    try {

        // 🤖 Telegram
        startTelegramBot();

        logger.info(
            "Telegram bot iniciado"
        );

        // ⏰ Scheduler
        startScheduler(bot);

        logger.info(
            "Scheduler iniciado"
        );

    } catch (error) {

        logger.error(
            `Erro bootstrap: ${error.message}`
        );

    }

}

// 🚀 Inicializa serviços
bootstrap();

// 🛑 Shutdown seguro
process.on(

    "SIGINT",

    async () => {

        try {

            logger.warn(
                "Encerrando aplicação..."
            );

            await sendRuntimeLog(

                "🛑 Sistema Offline",

                "DealFlow AI foi encerrado.",

                "warn"

            );

            // 🔌 Fecha Socket.IO
            io.close();

            // 🌐 Fecha servidor HTTP
            server.close(() => {

                logger.warn(
                    "Servidor encerrado"
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

            error.message,

            "error"

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

            "error"

        );

    }

);