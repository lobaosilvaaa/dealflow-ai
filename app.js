require("dotenv").config();

const express = require("express");
const session = require("express-session");

const {
    startTelegramBot,
    bot,
} = require("./src/adapters/telegram/telegram");

const {
    startScheduler,
} = require("./src/services/scheduler");

const {
    getStats,
} = require("./src/database/stats");

const {
    getChats,
} = require("./src/database/chats");

const app = express();

// 🚀 Configuração do EJS
app.set("view engine", "ejs");
app.set("views", "./src/views");

// 📦 Middlewares
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// 🔐 Middleware de autenticação
function isAuthenticated(req, res, next) {

    if (req.session.authenticated) {
        return next();
    }

    return res.redirect("/login");
}

// 🌐 Rota principal
app.get("/", (req, res) => {

    res.send("🚀 DealFlow AI rodando");

});

// 🔐 Login (GET)
app.get("/login", (req, res) => {

    res.render("login");

});

// 🔐 Login (POST)
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASSWORD
    ) {

        req.session.authenticated = true;

        console.log("🔐 Login administrativo realizado");

        return res.redirect("/dashboard");
    }

    return res.send("❌ Login inválido");

});

// 🚪 Logout
app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        console.log("🚪 Logout realizado");

        res.redirect("/login");

    });

});

// 📊 Dashboard protegido
app.get("/dashboard", isAuthenticated, async (req, res) => {

    try {

        const stats = await getStats();

        const chats = await getChats();

        res.render("dashboard", {
            sentPromos: stats.sent_promos,
            totalUsers: chats.length,
            uptime: process.uptime(),
        });

    } catch (error) {

        console.error(
            "❌ Erro ao carregar dashboard:",
            error.message
        );

        res.status(500).send(
            "❌ Erro ao carregar dashboard"
        );

    }

});

// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `🚀 Servidor rodando na porta ${PORT}`
    );

});

// 🤖 Inicializa Telegram
startTelegramBot();

// ⏰ Inicializa Scheduler
startScheduler(bot);