const { Telegraf } = require("telegraf");
const { processMessage } = require("../../core/bot");
const { addChat } = require("../../database/chats");

// 🔐 Token do .env
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// 📩 Recebimento de mensagens
bot.on("text", async (ctx) => {
    try {
        const chatId = ctx.chat.id;
        const message = ctx.message.text;

        console.log("📩 Mensagem recebida:");
        console.log("Chat ID:", chatId);
        console.log("Mensagem:", message);

        // 📌 Registrar chat automaticamente
        addChat(chatId);

        // 🧠 Processar no core
        const resposta = await processMessage(chatId, message);

        // 📤 Enviar resposta
        await ctx.reply(resposta);

        console.log("✅ Resposta enviada");
    } catch (error) {
        console.error("❌ Erro no Telegram:", error.message);
    }
});

// 🚀 Inicialização do bot
function startTelegramBot() {
    bot.launch();
    console.log("🤖 Telegram bot rodando...");
}

// 📦 Exportação
module.exports = {
    startTelegramBot,
    bot,
};