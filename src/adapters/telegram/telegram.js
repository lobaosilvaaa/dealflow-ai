const { Telegraf } = require("telegraf");
const { processMessage } = require("../../core/bot");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.on("text", async (ctx) => {
    const user = ctx.from.id;
    const message = ctx.message.text;

    const resposta = await processMessage(user, message);

    await ctx.reply(resposta);
});

function startTelegramBot() {
    bot.launch();
    console.log("🤖 Telegram bot rodando...");
}

module.exports = { startTelegramBot };