const {

    getAllUsers,

} = require(
    "../database/settings"
);

const {

    getRandomProduct,

} = require(
    "./products"
);

const {

    incrementPromos,

} = require(
    "../database/stats"
);

const {
    logger
} = require(
    "./logger"
);

// ⏱️ Controle de último envio
const lastSentMap = {};

// ⏰ Inicializa scheduler
function startScheduler(bot) {

    console.log(
        "⏰ Scheduler iniciado..."
    );

    setInterval(async () => {

        try {

            const users =
                await getAllUsers();

            for (const user of users) {

                // ⛔ Usuário pausado
                if (!user.active) {

                    continue;

                }

                const {

                    chat_id,
                    category,
                    frequency

                } = user;

                // ⏱️ Timestamp atual
                const now =
                    Date.now();

                // ⏱️ Último envio
                const lastSent =
                    lastSentMap[chat_id] || 0;

                // ⏱️ Frequência em ms
                const frequencyMs =
                    frequency * 60 * 1000;

                // ⛔ Ainda não chegou o momento
                if (

                    now - lastSent <
                    frequencyMs

                ) {

                    continue;

                }

                // 🎯 Produto aleatório
                const product =
                    getRandomProduct(category);

                if (!product) {

                    continue;

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

                // 📤 Envia promoção
                await bot.telegram.sendMessage(

                    chat_id,

                    message

                );

                // 📊 Incrementa estatísticas
                await incrementPromos();

                // ⏱️ Atualiza último envio
                lastSentMap[chat_id] =
                    now;

                logger.info(
                    `Promo enviada para ${chat_id}`
                );

                console.log(
                    `📤 Promo enviada para ${chat_id}`
                );

            }

        } catch (error) {

            console.log(
                `❌ Erro no scheduler: ${error.message}`
            );

            logger.error(
                `Erro no scheduler: ${error.message}`
            );

        }

    }, 10000);

}

module.exports = {

    startScheduler,

};