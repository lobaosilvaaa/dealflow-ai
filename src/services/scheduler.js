const { getChats } = require("../database/chats");

const {
    getCategory,
    getFrequency,
    isActive,
} = require("../database/settings");

const {
    incrementPromos,
} = require("../database/stats");

const { getRandomProduct } = require("./products");
const { generateCopy } = require("./copy");

// ⏰ Controle de schedulers individuais
const userIntervals = {};

function startScheduler(bot) {

    console.log("⏰ Scheduler iniciado...");

    // 🔄 Verifica novos usuários periodicamente
    setInterval(async () => {

        try {

            const chats = await getChats();

            if (!chats || chats.length === 0) {
                console.log("⚠️ Nenhum chat registrado");
                return;
            }

            for (const chatId of chats) {

                // 🔒 Evita duplicação de scheduler
                if (userIntervals[chatId]) {
                    continue;
                }

                // ⏰ Frequência individual
                const frequency = await getFrequency(chatId);

                console.log(
                    `⏰ Scheduler configurado para ${chatId} (${frequency} min)`
                );

                // 🚀 Scheduler individual
                userIntervals[chatId] = setInterval(async () => {

                    try {

                        // 🎛️ Verifica se promoções estão ativas
                        const active = await isActive(chatId);

                        if (!active) {
                            return;
                        }

                        // 🎯 Categoria personalizada
                        const category = await getCategory(chatId);

                        // 🛍️ Produto
                        const product = await getRandomProduct(category);

                        if (!product) {

                            console.log(
                                `⚠️ Nenhum produto encontrado para ${chatId}`
                            );

                            return;
                        }

                        // ✍️ Gera copy automática
                        const mensagem = generateCopy(product);

                        // 📤 Envia mensagem
                        await bot.telegram.sendMessage(
                            chatId,
                            mensagem
                        );

                        // 📊 Incrementa estatísticas
                        incrementPromos();

                        console.log(
                            `📤 Promo enviada para ${chatId}`
                        );

                    } catch (err) {

                        console.error(
                            `❌ Erro ao enviar para ${chatId}:`,
                            err.message
                        );

                    }

                }, frequency * 60000);

            }

        } catch (error) {

            console.error(
                "❌ Erro no scheduler:",
                error.message
            );

        }

    }, 10000);

}

module.exports = {
    startScheduler,
};