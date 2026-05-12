const fs = require("fs");

const path = require("path");

const {
    getStats,
} = require("../database/stats");

const {
    getChats,
} = require("../database/chats");

const {
    getAllUsers,
} = require("../database/settings");

async function dashboard(req, res) {

    try {

        const stats =
            await getStats();

        const chats =
            await getChats();

        const users =
            await getAllUsers();

        // 📜 Caminho do log
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

        res.render("dashboard", {

            sentPromos:
                stats.sent_promos,

            totalUsers:
                chats.length,

            uptime:
                process.uptime(),

            users,

            logs,

        });

    } catch (error) {

        console.error(
            "❌ Erro dashboard:",
            error.message
        );

        res.status(500).send(
            "Erro interno"
        );

    }

}

module.exports = {
    dashboard,
};