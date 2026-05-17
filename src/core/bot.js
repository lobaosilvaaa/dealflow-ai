// 🚀 DealFlowAI Core Bot

const {

    saveChat,
    getAllChats,

} = require(
    "../database/chats"
);

const {

    saveSettings,
    getSettings,

} = require(
    "../database/settings"
);

const {

    incrementPromos,
    getStats,

} = require(
    "../database/stats"
);

const {

    getRandomProduct,

} = require(
    "../services/products"
);

const {

    logger,
    sendRuntimeLog

} = require(
    "../services/logger"
);

// 🚀 Processa mensagens
async function processMessage(ctx) {

    try {

        // 🛡️ Validação contexto
        if (

            !ctx ||
            !ctx.chat ||
            !ctx.message

        ) {

            logger.warn(
                "Contexto Telegram inválido"
            );

            return;

        }

        const chatId =
            String(
                ctx.chat.id
            );

        const username =
            ctx.from?.username ||
            "unknown";

        const text =
            ctx.message.text?.trim();

        // 🛡️ Texto obrigatório
        if (!text) {

            return;

        }

        console.log(
            "📩 Mensagem recebida:"
        );

        console.log(
            `Chat ID: ${chatId}`
        );

        console.log(
            `Mensagem: ${text}`
        );

        logger.info(
            `Mensagem recebida: ${chatId} -> ${text}`
        );

        // 💾 Salva chat
        await saveChat(chatId);

        console.log(
            `💾 Chat salvo: ${chatId}`
        );

        // 📥 Configurações atuais
        const settings =
            await getSettings(chatId);

        // 🎯 Categoria atual
        const category =
            settings?.category || "geral";

        // ⏰ Frequência atual
        const frequency =
            settings?.frequency || 1;

        // 🤖 Status atual
        const active =
            settings?.active ?? 1;

        // 🚀 COMANDO /start
        if (

            text.toLowerCase() === "/start"

        ) {

            logger.info(
                `Start executado: ${chatId}`
            );

            return ctx.reply(`

🚀 Bem-vindo ao DealFlow AI!

Sua plataforma inteligente de promoções automáticas.

Digite:
menu

para visualizar os comandos disponíveis.

`);

        }

        // 🚀 COMANDO /categoria
        if (

            text.startsWith(
                "/categoria"
            )

        ) {

            const parts =
                text.split(" ");

            const newCategory =
                parts[1];

            if (!newCategory) {

                return ctx.reply(`

❌ Informe uma categoria.

Exemplo:
 /categoria gamer

`);

            }

            await saveSettings(

                chatId,

                newCategory,

                frequency,

                active

            );

            logger.info(
                `Categoria alterada: ${chatId} -> ${newCategory}`
            );

            // 📡 Runtime
            await sendRuntimeLog(

                "🎯 Categoria Alterada",

                `Usuário alterou categoria.

👤 User: ${username}
🆔 Chat ID: ${chatId}
🎯 Categoria: ${newCategory}`,

                "info"

            );

            return ctx.reply(`

✅ Categoria definida com sucesso!

🎯 Nova categoria:
${newCategory}

Agora suas promoções serão personalizadas.

`);

        }

        // ⏰ COMANDO /frequencia
        if (

            text.startsWith(
                "/frequencia"
            )

        ) {

            const parts =
                text.split(" ");

            const newFrequency =
                Number(parts[1]);

            if (

                !newFrequency ||
                newFrequency < 1

            ) {

                return ctx.reply(`

❌ Frequência inválida.

Exemplo:
 /frequencia 5

`);

            }

            await saveSettings(

                chatId,

                category,

                newFrequency,

                active

            );

            logger.info(
                `Frequência alterada: ${chatId} -> ${newFrequency} min`
            );

            return ctx.reply(`

✅ Frequência atualizada!

⏰ Nova frequência:
${newFrequency} minuto(s)

As promoções automáticas seguirão essa frequência.

`);

        }

        // 🔥 COMANDO promo
        if (

            text.toLowerCase() ===
            "promo"

        ) {

            // ⛔ Usuário pausado
            if (!active) {

                return ctx.reply(`

⏸️ Suas promoções estão pausadas.

Use:
/ativar

para voltar a receber promoções.

`);

            }

            const product =
                getRandomProduct(category);

            if (!product) {

                logger.warn(
                    `Nenhuma promoção encontrada: ${category}`
                );

                return ctx.reply(`

❌ Nenhuma promoção encontrada para:

${category}

`);

            }

            const message = `

🔥 OFERTA IMPERDÍVEL!

🛍️ ${product.name}
✨ ${product.description}

💰 ${product.price}
⚠️ Estoque limitado!

👉 Compre agora:
${product.link}

`;

            await ctx.reply(message);

            await incrementPromos();

            logger.info(
                `Promo enviada para ${chatId}`
            );

            console.log(
                "✅ Resposta enviada"
            );

            return;

        }

        // 📊 COMANDO /stats
        if (

            text.toLowerCase() ===
            "/stats"

        ) {

            const stats =
                await getStats();

            const chats =
                await getAllChats();

            return ctx.reply(`

📊 *DEALFLOW AI STATS*

📤 Promoções enviadas:
${stats?.sent_promos || 0}

👥 Usuários:
${chats.length}

━━━━━━━━━━━━━━━━━━

📌 Suas configurações:

🎯 Categoria:
${category}

⏰ Frequência:
${frequency} minuto(s)

🤖 Status:
${active ? "🟢 Ativado" : "🔴 Pausado"}

`, {

                parse_mode:
                    "Markdown"

            });

        }

        // ⏸️ COMANDO /pausar
        if (

            text.toLowerCase() ===
            "/pausar"

        ) {

            await saveSettings(

                chatId,

                category,

                frequency,
                0

            );

            logger.info(
                `Usuário pausado: ${chatId}`
            );

            return ctx.reply(`

⏸️ Promoções pausadas com sucesso.

Você não receberá promoções automáticas até ativar novamente.

`);

        }

        // ▶️ COMANDO /ativar
        if (

            text.toLowerCase() ===
            "/ativar"

        ) {

            await saveSettings(

                chatId,

                category,

                frequency,
                1

            );

            logger.info(
                `Usuário ativado: ${chatId}`
            );

            return ctx.reply(`

▶️ Promoções ativadas novamente.

As promoções automáticas voltarão a ser enviadas.

`);

        }

        // 🤖 Menu principal
        if (

            text.toLowerCase() === "menu"

        ) {

            return ctx.reply(`

🚀 *DealFlow AI Online*

━━━━━━━━━━━━━━━━━━

📌 Comandos disponíveis:

🎯 /categoria gamer
⏰ /frequencia 5
📊 /stats
⏸️ /pausar
▶️ /ativar

━━━━━━━━━━━━━━━━━━

🔥 Para receber promoções:
promo

`, {

                parse_mode:
                    "Markdown"

            });

        }

        // ❌ Resposta padrão
        return ctx.reply(`

❌ Comando não reconhecido.

Digite:
menu

`);

    } catch (error) {

        console.log(error);

        logger.error(
            `Erro bot: ${error.message}`
        );

        // 📡 Runtime alert
        await sendRuntimeLog(

            "❌ Bot Error",

            error.stack ||
            error.message,

            "error"

        );

        try {

            await ctx.reply(
                "❌ Erro interno no bot."
            );

        } catch (replyError) {

            console.log(
                "Erro reply:",
                replyError.message
            );

            logger.error(
                `Erro reply bot: ${replyError.message}`
            );

        }

    }

}

module.exports = {

    processMessage,

};