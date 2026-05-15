const fs =
    require("fs");

const path =
    require("path");

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

const {
    logger
} = require(
    "../services/logger"
);

// 📊 Estatísticas
async function stats(req, res) {

    try {

        const data =
            await getStats();

        const users =
            await getAllUsers();

        res.json({

            success: true,

            timestamp:
                new Date(),

            environment:
                "development",

            stats: {

                sentPromos:
                    data.sent_promos,

                totalUsers:
                    users.length,

                uptime:
                    Math.floor(
                        process.uptime()
                    ),

            }

        });

    } catch (error) {

        logger.error(
            `API stats error: ${error.message}`
        );

        res.status(500).json({

            success: false,

            error:
                error.message,

        });

    }

}

// 👥 Usuários
async function users(req, res) {

    try {

        const users =
            await getAllUsers();

        res.json({

            success: true,

            timestamp:
                new Date(),

            total:
                users.length,

            users,

        });

    } catch (error) {

        logger.error(
            `API users error: ${error.message}`
        );

        res.status(500).json({

            success: false,

            error:
                error.message,

        });

    }

}

// 📜 Logs
async function logs(req, res) {

    try {

        const logPath =
            path.join(

                __dirname,

                "../logs/app.log"

            );

        let logs = [];

        // 📖 Lê logs
        if (fs.existsSync(logPath)) {

            const content =
                fs.readFileSync(

                    logPath,

                    "utf8"

                );

            logs = content
                .split("\n")
                .filter(Boolean)
                .reverse()
                .slice(0, 20);

        }

        res.json({

            success: true,

            timestamp:
                new Date(),

            total:
                logs.length,

            logs,

        });

    } catch (error) {

        logger.error(
            `API logs error: ${error.message}`
        );

        res.status(500).json({

            success: false,

            error:
                error.message,

        });

    }

}

module.exports = {

    stats,

    users,

    logs,

};