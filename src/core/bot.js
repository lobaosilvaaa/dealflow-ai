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

} = require(
    "../database/stats"
);

const {

    getRandomProduct,

} = require(
    "../services/products"
);

const {
    logger
} = require(
    "../services/logger"
);

// 🚀 Processa mensagens
async function processMessage(ctx) {

    try {

        const chatId =
            String(
                ctx.chat.id
            );

        const text =
            ctx.message.text;

        console.log(
            "📩 Mensagem recebida:"
        );

        console.log(
            `Chat ID: ${chatId}`
        );

        console.log(
            `Mensagem: ${text}`
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

                frequency

            );

            logger.info(
                `Categoria alterada: ${chatId} -> ${newCategory}`
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

                newFrequency

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

            const product =
                getRandomProduct(category);

            if (!product) {

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

            return ctx.reply(`

📊 *DEALFLOW AI STATS*

📤 Promoções enviadas:
0

━━━━━━━━━━━━━━━━━━

📌 Suas configurações:

🎯 Categoria:
${category}

⏰ Frequência:
${frequency} minuto(s)

🤖 Status:
🟢 Ativado

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

        // 🤖 Mensagem padrão
        await ctx.reply(`

🚀 DealFlow AI Online

Comandos disponíveis:

🎯 /categoria gamer
⏰ /frequencia 5
📊 /stats
⏸️ /pausar
▶️ /ativar

Ou envie:
promo

`);

    } catch (error) {

        console.log(error);

        logger.error(
            `Erro bot: ${error.message}`
        );

        await ctx.reply(
            "❌ Erro interno no bot."
        );

    }

}

module.exports = {

    processMessage,

};