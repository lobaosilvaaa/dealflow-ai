const {
    logger,
} = require(
    "./logger"
);

const {
    getStats,
} = require(
    "../database/stats"
);

const {
    getAllUsers,
} = require(
    "../database/settings"
);

// ⏱️ Interval realtime
let metricsInterval = null;

// 📦 Último payload
let lastPayload = null;

// 📡 Inicializa métricas realtime
function startLiveMetrics(io) {

    // 🛡️ Evita múltiplos intervals
    if (metricsInterval) {

        logger.warn(
            "Live Metrics já iniciado"
        );

        return;

    }

    metricsInterval = setInterval(async () => {

        try {

            const stats =
                await getStats();

            const users =
                await getAllUsers();

            // 📊 Payload realtime
            const payload = {

                promos:
                    stats.sent_promos,

                users:
                    users.length,

                uptime:
                    Math.floor(
                        process.uptime()
                    ),

                memory:
                    Math.round(

                        process.memoryUsage().rss
                        / 1024
                        / 1024

                    ),

                timestamp:
                    new Date(),

                status:
                    "online"

            };

            // 🚫 Evita broadcast repetido
            if (

                JSON.stringify(payload) ===
                JSON.stringify(lastPayload)

            ) {

                return;

            }

            // 📡 Broadcast realtime
            io.emit(
                "live-metrics",
                payload
            );

            // 💾 Salva payload
            lastPayload =
                payload;

        } catch (error) {

            logger.error(

                `Erro live metrics: ${error.message}`

            );

        }

    }, 3000);

    logger.info(
        "Live Metrics iniciado"
    );

}

// 🛑 Encerra realtime
function stopLiveMetrics() {

    if (metricsInterval) {

        clearInterval(
            metricsInterval
        );

        metricsInterval = null;

        logger.warn(
            "Live Metrics encerrado"
        );

    }

}

module.exports = {

    startLiveMetrics,

    stopLiveMetrics,

};