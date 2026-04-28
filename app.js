require("dotenv").config();
const express = require("express");

// ✅ IMPORTAR OS DOIS
const { startTelegramBot, bot } = require("./src/adapters/telegram/telegram");
const { startScheduler } = require("./src/services/scheduler");

const app = express();

app.get("/", (req, res) => {
    res.send("🚀 DealFlow AI rodando (Telegram Only)");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// 🚀 INICIAR BOT
startTelegramBot();

// ⏰ INICIAR SCHEDULER (AGORA FUNCIONA)
startScheduler(bot);
