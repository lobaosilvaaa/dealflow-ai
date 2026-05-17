// 🚀 DealFlowAI Live Metrics Service

const {

    logger,
    sendRuntimeLog

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

// ⏱️ Timestamp último envio
let lastEmitAt = null;

// 📡 Inicializa métricas realtime
function startLiveMetrics(io) {

    // 🛡️ Evita múltiplos intervals
    if (metricsInterval) {

        logger.warn(
            "Live Metrics já iniciado"
        );

        return;

    }

    logger.info(
        "Inicializando Live Metrics..."
    );

    metricsInterval = setInterval(async () => {

        try {

            // 📊 Estatísticas
            const stats =
                await getStats();

            // 👥 Usuários
            const users =
                await getAllUsers();

            // 💾 Memória
            const memoryUsage =
                process.memoryUsage();

            // 📦 Payload realtime
            const payload = {

                promos:
                    stats?.sent_promos || 0,

                users:
                    users.length || 0,

                uptime:
                    Math.floor(
                        process.uptime()
                    ),

                memory: {

                    rss:
                        Math.round(

                            memoryUsage.rss
                            / 1024
                            / 1024

                        ),

                    heapUsed:
                        Math.round(

                            memoryUsage.heapUsed
                            / 1024
                            / 1024

                        ),

                    heapTotal:
                        Math.round(

                            memoryUsage.heapTotal
                            / 1024
                            / 1024

                        ),

                },

                environment:
                    process.env.NODE_ENV ||
                    "development",

                nodeVersion:
                    process.version,

                timestamp:
                    new Date(),

                status:
                    "online"

            };

            // 🚫 Evita broadcast duplicado
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

            // 💾 Cache payload
            lastPayload =
                payload;

            // ⏱️ Timestamp
            lastEmitAt =
                Date.now();

        } catch (error) {

            logger.error(

                `Erro live metrics: ${error.message}`

            );

            // 📡 Runtime log
            await sendRuntimeLog(

                "❌ Live Metrics Error",

                error.stack ||
                error.message,

                "error"

            );

        }

    }, 3000);

    logger.info(
        "Live Metrics iniciado"
    );

}

// 🛑 Encerra realtime
async function stopLiveMetrics() {

    try {

        if (!metricsInterval) {

            logger.warn(
                "Live Metrics já parado"
            );

            return;

        }

        clearInterval(
            metricsInterval
        );

        metricsInterval =
            null;

        lastPayload =
            null;

        lastEmitAt =
            null;

        logger.warn(
            "Live Metrics encerrado"
        );

        // 📡 Runtime log
        await sendRuntimeLog(

            "🛑 Live Metrics Offline",

            "Realtime metrics service encerrado.",

            "warn"

        );

    } catch (error) {

        logger.error(
            `Erro stopLiveMetrics: ${error.message}`
        );

    }

}

// 📊 Status realtime
function getLiveMetricsStatus() {

    return {

        active:
            Boolean(metricsInterval),

        lastEmitAt,

        uptime:
            Math.floor(
                process.uptime()
            ),

    };

}

module.exports = {

    startLiveMetrics,

    stopLiveMetrics,

    getLiveMetricsStatus,

};