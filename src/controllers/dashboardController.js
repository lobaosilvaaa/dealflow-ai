// 🚀 DealFlowAI Dashboard Controller

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

// 📊 Dashboard principal
async function dashboard(req, res) {

    try {

        // 📊 Estatísticas
        const stats =
            await getStats();

        // 👥 Usuários
        const users =
            await getAllUsers();

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
                .slice(0, 10);

        }

        // 📦 Informações sistema
        const systemInfo = {

            environment:
                ENVIRONMENT,

            nodeVersion:
                process.version,

            memoryUsage:
                Math.round(

                    process.memoryUsage().rss
                    / 1024
                    / 1024

                ),

            uptime:
                Math.floor(
                    process.uptime()
                ),

        };

        // 📜 Logs acesso dashboard
        logger.info(
            "Dashboard acessado"
        );

        // 🚀 Render dashboard
        return res.render(

            "dashboard",

            {

                sentPromos:
                    stats?.sent_promos || 0,

                totalUsers:
                    users.length || 0,

                uptime:
                    systemInfo.uptime,

                users,

                logs,

                environment:
                    systemInfo.environment,

                nodeVersion:
                    systemInfo.nodeVersion,

                memoryUsage:
                    systemInfo.memoryUsage,

            }

        );

    } catch (error) {

        logger.error(
            `Erro dashboard: ${error.message}`
        );

        console.log(
            "❌ Erro dashboard:",
            error.message
        );

        // 📡 Runtime alert
        await sendRuntimeLog(

            "❌ Dashboard Error",

            error.stack ||
            error.message,

            "error"

        );

        return res.status(500).send(
            "❌ Erro interno dashboard"
        );

    }

}

module.exports = {

    dashboard,

};