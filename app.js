require("dotenv").config();

const express = require("express");

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

// 🌐 Rota principal
app.get("/", (req, res) => {

    res.send("🚀 DealFlow AI rodando");

});

// 📊 Dashboard administrativo
app.get("/dashboard", async (req, res) => {

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

        res.status(500).send("Erro ao carregar dashboard");

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