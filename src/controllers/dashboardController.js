const fs = require("fs");

const path = require("path");

const {
    getStats,
} = require("../database/stats");

const {
    getAllUsers,
} = require("../database/settings");

const {
    logger
} = require(
    "../services/logger"
);

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
        const logPath = path.join(
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
                .slice(0, 10);

        }

        // 🚀 Render dashboard
        res.render("dashboard", {

            sentPromos:
                stats?.sent_promos || 0,

            totalUsers:
                users.length || 0,

            uptime:
                process.uptime(),

            users,

            logs,

        });

    } catch (error) {

        logger.error(
            `Erro dashboard: ${error.message}`
        );

        console.log(
            "❌ Erro dashboard:",
            error.message
        );

        res.status(500).send(
            "❌ Erro interno dashboard"
        );

    }

}

module.exports = {

    dashboard,

};