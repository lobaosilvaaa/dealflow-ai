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

    }, 60000);

}

module.exports = {

    startScheduler,

};