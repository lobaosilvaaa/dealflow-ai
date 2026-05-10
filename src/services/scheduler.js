const { getChats } = require("../database/chats");

const {
    getCategory,
    getFrequency,
} = require("../database/settings");

const { getRandomProduct } = require("./products");
const { generateCopy } = require("./copy");

const userIntervals = {};

function startScheduler(bot) {

    console.log("⏰ Scheduler iniciado...");

    setInterval(async () => {

        const chats = await getChats();

        for (const chatId of chats) {

            if (userIntervals[chatId]) continue;

            const frequency = await getFrequency(chatId);

            userIntervals[chatId] = setInterval(async () => {

                try {

                    const category = await getCategory(chatId);

                    const product = await getRandomProduct(category);

                    const mensagem = generateCopy(product);

                    await bot.telegram.sendMessage(chatId, mensagem);

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

            console.log(
                `⏰ Scheduler configurado para ${chatId} (${frequency} min)`
            );

        }

    }, 10000);

}

module.exports = {
    startScheduler,
};