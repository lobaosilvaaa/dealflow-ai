require("dotenv").config();

const express = require("express");

const session =
    require("express-session");

const {
    startTelegramBot,
    bot,
} = require(
    "./src/adapters/telegram/telegram"
);

const {
    startScheduler,
} = require(
    "./src/services/scheduler"
);

// 📦 Rotas
const authRoutes =
    require("./src/routes/authRoutes");

const dashboardRoutes =
    require("./src/routes/dashboardRoutes");

const adminRoutes =
    require("./src/routes/adminRoutes");

const app = express();

// 🚀 Configuração EJS
app.set("view engine", "ejs");

app.set("views", "./src/views");

// 📦 Middlewares
app.use(express.urlencoded({
    extended: true
}));

// 🌐 Arquivos estáticos
app.use(express.static("public"));

// 🔐 Sessão
app.use(session({

    secret:
        process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

}));

// 🌐 Rotas
app.use(authRoutes);

app.use(dashboardRoutes);

app.use(adminRoutes);

// 🏠 Home
app.get("/", (req, res) => {

    res.send(
        "🚀 DealFlow AI rodando"
    );

});

// 🚀 Inicialização servidor
const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `🚀 Servidor rodando na porta ${PORT}`
    );

});

// 🤖 Inicializa Telegram
startTelegramBot();

// ⏰ Inicializa Scheduler
startScheduler(bot);