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

// 📊 Banco
const {
    getStats,
} = require(
    "./src/database/stats"
);

const {
    getAllUsers,
} = require(
    "./src/database/settings"
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

// 🔗 Logger realtime
setSocket(io);

io.on("connection", () => {

    logger.info(
        "Cliente realtime conectado"
    );

});

// 🚀 Configurações
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

// 🌐 Static
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

        uptime:
            process.uptime(),

        timestamp:
            new Date(),

    });

});

// 📡 Live Metrics
setInterval(async () => {

    try {

        const stats =
            await getStats();

        const users =
            await getAllUsers();

        io.emit("live-metrics", {

            promos:
                stats.sent_promos,

            users:
                users.length,

            uptime:
                Math.floor(
                    process.uptime()
                ),

        });

    } catch (error) {

        logger.error(

            `Erro live metrics: ${error.message}`

        );

    }

}, 3000);

// 🚀 Inicialização servidor
server.listen(PORT, async () => {

    logger.info(
        `Servidor rodando na porta ${PORT}`
    );

    await sendRuntimeLog(

        "🚀 Sistema Online",

        "DealFlow AI iniciado com sucesso."

    );

});

// 🤖 Telegram
startTelegramBot();

// ⏰ Scheduler
startScheduler(bot);

// 🛑 Shutdown seguro
process.on(

    "SIGINT",

    async () => {

        logger.warn(
            "Encerrando aplicação..."
        );

        await sendRuntimeLog(

            "🛑 Sistema Offline",

            "DealFlow AI foi encerrado.",

            "warn"

        );

        process.exit();

    }

);

// ❌ Erros críticos
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