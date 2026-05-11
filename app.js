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

const {
    getAllUsers,
    updateUserStatus,
    deleteUser,
} = require("./src/database/settings");

const app = express();

// 🚀 Configuração EJS
app.set("view engine", "ejs");
app.set("views", "./src/views");

// 📦 Middlewares
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// 🔐 Middleware auth
function isAuthenticated(req, res, next) {

    if (req.session.authenticated) {
        return next();
    }

    return res.redirect("/login");
}

// 🌐 Home
app.get("/", (req, res) => {

    res.send("🚀 DealFlow AI rodando");

});

// 🔐 Login page
app.get("/login", (req, res) => {

    res.render("login");

});

// 🔐 Login auth
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

// 📊 Dashboard
app.get("/dashboard", isAuthenticated, async (req, res) => {

    try {

        const stats = await getStats();

        const chats = await getChats();

        const users = await getAllUsers();

        res.render("dashboard", {
            sentPromos: stats.sent_promos,
            totalUsers: chats.length,
            uptime: process.uptime(),
            users,
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

// ▶️ Ativar usuário
app.post(
    "/admin/activate/:chatId",
    isAuthenticated,
    (req, res) => {

        updateUserStatus(req.params.chatId, 1);

        console.log(
            `▶️ Usuário ativado: ${req.params.chatId}`
        );

        res.redirect("/dashboard");

    }
);

// ⏸️ Pausar usuário
app.post(
    "/admin/pause/:chatId",
    isAuthenticated,
    (req, res) => {

        updateUserStatus(req.params.chatId, 0);

        console.log(
            `⏸️ Usuário pausado: ${req.params.chatId}`
        );

        res.redirect("/dashboard");

    }
);

// 🗑️ Remover usuário
app.post(
    "/admin/delete/:chatId",
    isAuthenticated,
    (req, res) => {

        deleteUser(req.params.chatId);

        console.log(
            `🗑️ Usuário removido: ${req.params.chatId}`
        );

        res.redirect("/dashboard");

    }
);

// 🚀 Inicialização
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `🚀 Servidor rodando na porta ${PORT}`
    );

});

// 🤖 Telegram
startTelegramBot();

// ⏰ Scheduler
startScheduler(bot);