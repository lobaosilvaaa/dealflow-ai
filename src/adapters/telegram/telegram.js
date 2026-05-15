const {
    Telegraf
} = require(
    "telegraf"
);

const {
    processMessage
} = require(
    "../../core/bot"
);

// 🤖 Instância do bot
const bot =
    new Telegraf(
        process.env.TELEGRAM_BOT_TOKEN
    );

// 🚀 Inicializa Telegram
function startTelegramBot() {

    // 📩 Recebe mensagens de texto
    bot.on("text", async ctx => {

        try {

            await processMessage(ctx);

        } catch (error) {

            console.log(
                "❌ Erro Telegram:",
                error.message
            );

            try {

                await ctx.reply(
                    "❌ Erro interno no bot."
                );

            } catch (replyError) {

                console.log(
                    "❌ Erro ao responder usuário:",
                    replyError.message
                );

            }

        }

    });

    // 🚀 Inicializa bot
    bot.launch();

    console.log(
        "🤖 Telegram bot rodando..."
    );

    // 🛑 Encerramento seguro
    process.once(

        "SIGINT",

        () => bot.stop("SIGINT")

    );

    process.once(

        "SIGTERM",

        () => bot.stop("SIGTERM")

    );

}

module.exports = {

    startTelegramBot,

    bot,

};