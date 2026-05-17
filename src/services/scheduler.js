// 🚀 DealFlowAI Scheduler Service

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

    generateCopy,

} = require(
    "./copy"
);

const {

    logger,
    sendRuntimeLog

} = require(
    "./logger"
);

// ⏱️ Controle scheduler
let schedulerInterval = null;

// ⏱️ Controle último envio
const lastSentMap = {};

// 📊 Estatísticas runtime
const schedulerStats = {

    totalSent: 0,

    totalErrors: 0,

    startedAt: null,

};

// 🚀 Inicializa scheduler
function startScheduler(bot) {

    // 🛡️ Evita múltiplos schedulers
    if (schedulerInterval) {

        logger.warn(
            "Scheduler já iniciado"
        );

        return;

    }

    schedulerStats.startedAt =
        new Date();

    console.log(
        "⏰ Scheduler iniciado..."
    );

    logger.info(
        "Scheduler iniciado"
    );

    // 📡 Runtime
    sendRuntimeLog(

        "⏰ Scheduler Online",

        "Sistema automático de promoções iniciado.",

        "scheduler",

        "healthy",

        "⚙️ Scheduler"

    );

    schedulerInterval = setInterval(async () => {

        try {

            // 👥 Usuários
            const users =
                await getAllUsers();

            // 🛡️ Nenhum usuário
            if (

                !users ||
                users.length === 0

            ) {

                return;

            }

            // 🔄 Itera usuários
            for (const user of users) {

                try {

                    // ⛔ Usuário pausado
                    if (!user.active) {

                        continue;

                    }

                    const {

                        chat_id,
                        category,
                        frequency

                    } = user;

                    // 🛡️ Dados obrigatórios
                    if (

                        !chat_id ||
                        !frequency

                    ) {

                        continue;

                    }

                    // ⏱️ Timestamp atual
                    const now =
                        Date.now();

                    // ⏱️ Último envio
                    const lastSent =
                        lastSentMap[chat_id] || 0;

                    // ⏱️ Frequência ms
                    const frequencyMs =
                        frequency * 60 * 1000;

                    // ⛔ Ainda não chegou momento
                    if (

                        now - lastSent <
                        frequencyMs

                    ) {

                        continue;

                    }

                    // 🎯 Produto
                    const product =
                        getRandomProduct(category);

                    // ⛔ Produto inexistente
                    if (!product) {

                        logger.warn(
                            `Produto não encontrado: ${category}`
                        );

                        continue;

                    }

                    // 📝 Gera copy
                    const message =
                        generateCopy(product);

                    // 📤 Envia Telegram
                    await bot.telegram.sendMessage(

                        chat_id,

                        message

                    );

                    // 📊 Incrementa stats
                    await incrementPromos();

                    // ⏱️ Atualiza último envio
                    lastSentMap[chat_id] =
                        now;

                    // 📊 Runtime stats
                    schedulerStats.totalSent++;

                    logger.info(
                        `Promo enviada para ${chat_id}`
                    );

                    console.log(
                        `📤 Promo enviada para ${chat_id}`
                    );

                } catch (userError) {

                    schedulerStats.totalErrors++;

                    logger.error(

                        `Erro envio usuário: ${userError.message}`

                    );

                    // 📡 Runtime log
                    await sendRuntimeLog(

                        "❌ Scheduler User Error",

                        userError.stack ||
                        userError.message,

                        "scheduler",

                        "error",

                        "📤 User Delivery"

                    );

                }

            }

        } catch (error) {

            schedulerStats.totalErrors++;

            console.log(
                `❌ Erro scheduler: ${error.message}`
            );

            logger.error(
                `Erro scheduler: ${error.message}`
            );

            // 📡 Runtime log
            await sendRuntimeLog(

                "❌ Scheduler Critical Error",

                error.stack ||
                error.message,

                "scheduler",

                "error",

                "⚙️ Scheduler"

            );

        }

    }, 10000);

}

// 🛑 Encerra scheduler
async function stopScheduler() {

    try {

        if (!schedulerInterval) {

            logger.warn(
                "Scheduler já parado"
            );

            return;

        }

        clearInterval(
            schedulerInterval
        );

        schedulerInterval =
            null;

        logger.warn(
            "Scheduler encerrado"
        );

        // 📡 Runtime
        await sendRuntimeLog(

            "🛑 Scheduler Offline",

            "Sistema automático de promoções encerrado.",

            "scheduler",

            "offline",

            "⚙️ Scheduler"

        );

    } catch (error) {

        logger.error(
            `Erro stopScheduler: ${error.message}`
        );

    }

}

// 📊 Status scheduler
function getSchedulerStatus() {

    return {

        active:
            Boolean(schedulerInterval),

        stats:
            schedulerStats,

        usersTracked:
            Object.keys(lastSentMap).length,

    };

}

module.exports = {

    startScheduler,

    stopScheduler,

    getSchedulerStatus,

};