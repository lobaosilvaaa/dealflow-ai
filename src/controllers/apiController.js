// 🚀 DealFlowAI API Controller

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

    logger,
    sendRuntimeLog

} = require(
    "../services/logger"
);

// 🌎 Ambiente
const ENVIRONMENT =
    process.env.NODE_ENV ||
    "development";

// 📊 Estatísticas
async function stats(req, res) {

    try {

        // 📊 Busca dados
        const data =
            await getStats();

        const users =
            await getAllUsers();

        // 📦 Payload
        const payload = {

            success: true,

            timestamp:
                new Date(),

            environment:
                ENVIRONMENT,

            stats: {

                sentPromos:
                    data?.sent_promos || 0,

                totalUsers:
                    users.length,

                uptime:
                    Math.floor(
                        process.uptime()
                    ),

                memoryUsage:
                    Math.round(

                        process.memoryUsage().rss
                        / 1024
                        / 1024

                    ),

                nodeVersion:
                    process.version,

            }

        };

        // 📜 Log API
        logger.info(
            "API /stats acessada"
        );

        // 🚀 Resposta
        return res.json(
            payload
        );

    } catch (error) {

        logger.error(
            `API stats error: ${error.message}`
        );

        // 📡 Runtime alert
        await sendRuntimeLog(

            "❌ API Stats Error",

            error.stack ||
            error.message,

            "error"

        );

        return res.status(500).json({

            success: false,

            error:
                error.message,

        });

    }

}

// 👥 Usuários
async function users(req, res) {

    try {

        // 👥 Busca usuários
        const users =
            await getAllUsers();

        // 📦 Payload
        const payload = {

            success: true,

            timestamp:
                new Date(),

            environment:
                ENVIRONMENT,

            total:
                users.length,

            users,

        };

        // 📜 Log API
        logger.info(
            "API /users acessada"
        );

        // 🚀 Resposta
        return res.json(
            payload
        );

    } catch (error) {

        logger.error(
            `API users error: ${error.message}`
        );

        // 📡 Runtime alert
        await sendRuntimeLog(

            "❌ API Users Error",

            error.stack ||
            error.message,

            "error"

        );

        return res.status(500).json({

            success: false,

            error:
                error.message,

        });

    }

}

// 📜 Logs
async function logs(req, res) {

    try {

        // 📜 Caminho logs
        const logPath =
            path.join(

                __dirname,

                "../logs/app.log"

            );

        let logs = [];

        // 📖 Lê logs
        if (

            fs.existsSync(logPath)

        ) {

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

        // 📦 Payload
        const payload = {

            success: true,

            timestamp:
                new Date(),

            environment:
                ENVIRONMENT,

            total:
                logs.length,

            logs,

        };

        // 📜 Log API
        logger.info(
            "API /logs acessada"
        );

        // 🚀 Resposta
        return res.json(
            payload
        );

    } catch (error) {

        logger.error(
            `API logs error: ${error.message}`
        );

        // 📡 Runtime alert
        await sendRuntimeLog(

            "❌ API Logs Error",

            error.stack ||
            error.message,

            "error"

        );

        return res.status(500).json({

            success: false,

            error:
                error.message,

        });

    }

}

// ❤️ Healthcheck
async function health(req, res) {

    try {

        // 📦 Payload health
        const payload = {

            success: true,

            status:
                "online",

            timestamp:
                new Date(),

            environment:
                ENVIRONMENT,

            uptime:
                Math.floor(
                    process.uptime()
                ),

            memoryUsage:
                Math.round(

                    process.memoryUsage().rss
                    / 1024
                    / 1024

                ),

            nodeVersion:
                process.version,

        };

        return res.json(
            payload
        );

    } catch (error) {

        logger.error(
            `API health error: ${error.message}`
        );

        return res.status(500).json({

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

    health,

};