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
            ctx.from?.first_name ||
            "unknown";

        const text =
            ctx.message.text
                ?.trim()
                ?.toLowerCase();

        // 🛡️ Texto obrigatório
        if (!text) {

            return;

        }

        logger.info(
            `Mensagem recebida: ${chatId} -> ${text}`
        );

        // 💾 Salva chat
        await saveChat(chatId);

        logger.info(
            `Chat salvo: ${chatId}`
        );

        // 🔍 Busca configurações
        let settings =
            await getSettings(chatId);

        // 🆕 Novo usuário
        if (!settings) {

            await saveSettings(

                chatId,

                "geral",

                1,

                1

            );

            logger.info(
                `Novo usuário registrado: ${chatId}`
            );

            settings =
                await getSettings(chatId);

            // 📡 Runtime
            await sendRuntimeLog(

                "👤 Novo Usuário",

                `Novo usuário registrado no DealFlowAI.

👤 Username: ${username}
🆔 Chat ID: ${chatId}
🎯 Categoria: geral
⏰ Frequência: 1 minuto`,

                "info"

            );

        }

        // 🎯 Config atual
        const category =
            settings?.category || "geral";

        // ⏰ Frequência atual
        const frequency =
            settings?.frequency || 1;

        // 🤖 Status atual
        const active =
            settings?.active ?? 1;

        // 🚀 START
        if (

            text === "/start"

        ) {

            logger.info(
                `Start executado: ${chatId}`
            );

            return ctx.reply(`

🚀 Bem-vindo ao DealFlow AI

Sua plataforma inteligente de promoções automáticas.

━━━━━━━━━━━━━━━━━━

📌 Configuração atual:

🎯 Categoria:
${category}

⏰ Frequência:
${frequency} minuto(s)

🤖 Status:
${active ? "🟢 Ativado" : "🔴 Pausado"}

━━━━━━━━━━━━━━━━━━

Digite:
menu

para visualizar todos os comandos.

`);

        }

        // 📚 MENU
        if (

            text === "menu"

        ) {

            return ctx.reply(`

🚀 *DealFlow AI Online*

━━━━━━━━━━━━━━━━━━

📌 Comandos disponíveis:

🎯 /categoria gamer
🌎 /categoria geral

⏰ /frequencia 5

📊 /stats

⏸️ /pausar
▶️ /ativar

━━━━━━━━━━━━━━━━━━

🔥 Para receber promoção instantânea:

promo

━━━━━━━━━━━━━━━━━━

🤖 Sistema realtime ativo.

`, {

                parse_mode:
                    "Markdown"

            });

        }

        // 🎯 Categoria
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

            await sendRuntimeLog(

                "🎯 Categoria Alterada",

                `Usuário alterou categoria.

👤 Username: ${username}
🆔 Chat ID: ${chatId}
🎯 Categoria: ${newCategory}`,

                "info"

            );

            return ctx.reply(`

✅ Categoria atualizada!

🎯 Nova categoria:
${newCategory}

`);

        }

        // ⏰ Frequência
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

                isNaN(newFrequency) ||
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
                `Frequência alterada: ${chatId} -> ${newFrequency}`
            );

            return ctx.reply(`

✅ Frequência atualizada!

⏰ Nova frequência:
${newFrequency} minuto(s)

`);

        }

        // 🔥 PROMO
        if (

            text === "promo"

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

            // 🛡️ Produto inexistente
            if (!product) {

                logger.warn(
                    `Produto não encontrado: ${category}`
                );

                return ctx.reply(`

❌ Nenhuma promoção encontrada.

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

            // 📈 Incrementa métricas
            await incrementPromos();

            logger.info(
                `Promo enviada para ${chatId}`
            );

            return;

        }

        // 📊 STATS
        if (

            text === "/stats"

        ) {

            const stats =
                await getStats();

            const chats =
                await getAllChats();

            return ctx.reply(`

📊 *DEALFLOW AI STATS*

━━━━━━━━━━━━━━━━━━

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

        // ⏸️ PAUSAR
        if (

            text === "/pausar"

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

⏸️ Promoções pausadas.

`);

        }

        // ▶️ ATIVAR
        if (

            text === "/ativar"

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

`);

        }

        // ❌ Fallback
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

        // 📡 Runtime Alert
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

            logger.error(
                `Erro reply bot: ${replyError.message}`
            );

        }

    }

}

module.exports = {

    processMessage,

};