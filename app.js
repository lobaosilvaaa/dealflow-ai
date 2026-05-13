require("dotenv").config();

const express = require("express");

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

// 🔊 Logger Socket
const {
    setSocket,
} = require(
    "./src/services/logger"
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

const app = express();

// 🌐 HTTP Server
const server =
    http.createServer(app);

// 🔌 Socket.IO
const io =
    new Server(server);

// 🔗 Vincula socket ao logger
setSocket(io);

// 🔌 Conexão realtime
io.on("connection", socket => {

    console.log(
        "🔌 Cliente realtime conectado"
    );

});

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

// 📚 Swagger Docs
app.use(

    "/api/docs",

    swaggerUi.serve,

    swaggerUi.setup(swaggerSpec)

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

// 🚀 Inicialização servidor
const PORT =
    process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(
        `🚀 Servidor rodando na porta ${PORT}`
    );

});

// 🤖 Inicializa Telegram
startTelegramBot();

// ⏰ Inicializa Scheduler
startScheduler(bot);