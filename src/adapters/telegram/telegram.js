const { Telegraf } = require("telegraf");
const { processMessage } = require("../../core/bot");
const { addChat } = require("../../database/chats");
const sendRuntimeLog = require("../../services/runtimeLogger");

// 🔐 Token do .env
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// 📩 Recebimento de mensagens
bot.on("text", async (ctx) => {
    try {
        const chatId = ctx.chat.id;
        const message = ctx.message.text;

        const username =
            ctx.from.username ||
            ctx.from.first_name ||
            "Usuário desconhecido";

        console.log("📩 Mensagem recebida:");
        console.log("Chat ID:", chatId);
        console.log("Mensagem:", message);

        // 📌 Registrar chat automaticamente
        addChat(chatId);

        // 📡 Runtime log - mensagem recebida
        sendRuntimeLog(
            "📨 Nova Mensagem Recebida",
            `Usuário: ${username}\nChat ID: ${chatId}\nMensagem: ${message}`
        );

        // 🧠 Processar no core
        const resposta = await processMessage(chatId, message);

        // 📤 Enviar resposta
        await ctx.reply(resposta);

        console.log("✅ Resposta enviada");

        // 📡 Runtime log - resposta enviada
        sendRuntimeLog(
            "✅ Resposta Enviada",
            `Resposta enviada para ${username}`
        );

    } catch (error) {
        console.error("❌ Erro no Telegram:", error.message);

        // 🚨 Runtime log - erro
        sendRuntimeLog(
            "❌ Telegram Bot Error",
            error.message,
            15548997
        );
    }
});

// 🚀 Inicialização do bot
function startTelegramBot() {
    bot.launch();

    console.log("🤖 Telegram bot rodando...");

    // 📡 Runtime log - bot online
    sendRuntimeLog(
        "🟢 Telegram Bot Online",
        "O bot do Telegram foi iniciado com sucesso."
    );
}

// 🛑 Encerramento seguro
process.once("SIGINT", () => {
    console.log("🛑 Encerrando Telegram Bot (SIGINT)");

    sendRuntimeLog(
        "🛑 Telegram Bot Offline",
        "O bot do Telegram foi encerrado via SIGINT.",
        16776960
    );

    bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
    console.log("🛑 Encerrando Telegram Bot (SIGTERM)");

    sendRuntimeLog(
        "🛑 Telegram Bot Offline",
        "O bot do Telegram foi encerrado via SIGTERM.",
        16776960
    );

    bot.stop("SIGTERM");
});

// 🚨 Captura global de erros
process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);

    sendRuntimeLog(
        "🚨 Uncaught Exception",
        error.stack || error.message,
        15548997
    );
});

process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason);

    sendRuntimeLog(
        "🚨 Unhandled Rejection",
        String(reason),
        15548997
    );
});

// 📦 Exportação
module.exports = {
    startTelegramBot,
    bot,
};