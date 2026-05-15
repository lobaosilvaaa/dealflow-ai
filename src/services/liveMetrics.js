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

// 📡 Inicializa métricas realtime
function startLiveMetrics(io) {

    setInterval(async () => {

        try {

            const stats =
                await getStats();

            const users =
                await getAllUsers();

            io.emit("live-metrics", {

                promos:
                    stats.sent_promos,

                users:
                    users.length,

                uptime:
                    Math.floor(
                        process.uptime()
                    ),

            });

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

module.exports = {

    startLiveMetrics,

};