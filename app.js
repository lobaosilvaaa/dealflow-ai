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

    setSocket,
    sendRuntimeLog,

} = require(
    "./src/services/logger"
);

// 📊 Métricas
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
    new Server(server);

// 🔗 Vincula Socket.IO ao logger
setSocket(io);

// 🔌 Cliente realtime
io.on("connection", socket => {

    console.log(
        "🔌 Cliente realtime conectado"
    );

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

        console.log(

            "❌ Erro live metrics:",

            error.message

        );

    }

}, 3000);

// 🚀 Configuração EJS
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

// 🚀 Inicializa servidor
const PORT =
    process.env.PORT || 3000;

server.listen(PORT, async () => {

    console.log(
        `🚀 Servidor rodando na porta ${PORT}`
    );

    // 📢 Runtime log online
    await sendRuntimeLog(

        "🚀 Sistema Online",

        "DealFlow AI iniciado com sucesso."

    );

});

// 🤖 Inicializa Telegram
startTelegramBot();

// ⏰ Inicializa Scheduler
startScheduler(bot);

// 🛑 Encerramento seguro
process.on(

    "SIGINT",

    async () => {

        await sendRuntimeLog(

            "🛑 Sistema Offline",

            "DealFlow AI foi encerrado.",

            "warn"

        );

        process.exit();

    }

);

// ❌ Captura erros críticos
process.on(

    "uncaughtException",

    async error => {

        console.log(
            "❌ Uncaught Exception:",
            error.message
        );

        await sendRuntimeLog(

            "❌ Uncaught Exception",

            error.message,

            "error"

        );

    }

);

// ❌ Captura promise rejection
process.on(

    "unhandledRejection",

    async error => {

        console.log(
            "❌ Unhandled Rejection:",
            error
        );

        await sendRuntimeLog(

            "❌ Unhandled Rejection",

            String(error),

            "error"

        );

    }

);