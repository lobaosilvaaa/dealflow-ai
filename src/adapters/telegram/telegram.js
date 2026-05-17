// 🚀 DealFlowAI Telegram Adapter

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

const {
    logger,
    sendRuntimeLog
} = require(
    "../../services/logger"
);

// 🛡️ Token obrigatório
if (

    !process.env.TELEGRAM_BOT_TOKEN

) {

    throw new Error(
        "TELEGRAM_BOT_TOKEN não definido"
    );

}

// 🤖 Instância bot
const bot =
    new Telegraf(
        process.env.TELEGRAM_BOT_TOKEN
    );

// 🚀 Inicializa Telegram
function startTelegramBot() {

    // 📩 Recebe mensagens texto
    bot.on("text", async ctx => {

        try {

            // 🛡️ Context validation
            if (

                !ctx ||
                !ctx.message

            ) {

                logger.warn(
                    "Contexto Telegram inválido"
                );

                return;

            }

            const chatId =
                ctx.chat?.id;

            const username =
                ctx.from?.username ||
                "unknown";

            const text =
                ctx.message?.text ||
                "";

            // 📜 Log entrada
            logger.info(

                `Mensagem recebida: ${chatId} -> ${text}`

            );

            // 🚀 Runtime Discord
            await sendRuntimeLog(

                "📩 Telegram Message",

                `Nova mensagem recebida.

👤 User: ${username}
🆔 Chat ID: ${chatId}
💬 Message: ${text}`,

                "info"

            );

            // 🤖 Processa bot
            await processMessage(ctx);

        } catch (error) {

            logger.error(

                `Erro Telegram: ${error.message}`

            );

            console.log(
                "❌ Erro Telegram:",
                error.message
            );

            // 🚨 Runtime alert
            await sendRuntimeLog(

                "❌ Telegram Error",

                error.stack ||
                error.message,

                "error"

            );

            // 🛡️ Tenta responder
            try {

                if (

                    ctx &&
                    typeof ctx.reply === "function"

                ) {

                    await ctx.reply(
                        "❌ Erro interno no bot."
                    );

                }

            } catch (replyError) {

                logger.error(

                    `Erro reply Telegram: ${replyError.message}`

                );

                console.log(

                    "❌ Erro ao responder usuário:",

                    replyError.message

                );

            }

        }

    });

    // 🚀 Inicializa bot
    bot.launch();

    logger.info(
        "Telegram bot iniciado"
    );

    console.log(
        "🤖 Telegram bot rodando..."
    );

    // 🚀 Runtime startup
    sendRuntimeLog(

        "🤖 Telegram Online",

        "Telegram bot iniciado com sucesso.",

        "success"

    );

    // 🛑 Encerramento seguro
    process.once(

        "SIGINT",

        async () => {

            logger.warn(
                "Telegram encerrado via SIGINT"
            );

            await sendRuntimeLog(

                "🛑 Telegram Offline",

                "Telegram bot encerrado via SIGINT.",

                "warn"

            );

            bot.stop("SIGINT");

        }

    );

    process.once(

        "SIGTERM",

        async () => {

            logger.warn(
                "Telegram encerrado via SIGTERM"
            );

            await sendRuntimeLog(

                "🛑 Telegram Offline",

                "Telegram bot encerrado via SIGTERM.",

                "warn"

            );

            bot.stop("SIGTERM");

        }

    );

    // 🚨 Captura erros internos Telegraf
    bot.catch(async error => {

        logger.error(

            `Telegraf internal error: ${error.message}`

        );

        await sendRuntimeLog(

            "❌ Telegraf Error",

            error.stack ||
            error.message,

            "error"

        );

    });

}

module.exports = {

    startTelegramBot,

    bot,

};