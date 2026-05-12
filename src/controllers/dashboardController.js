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

        const stats = await getStats();

        const chats = await getChats();

        const users = await getAllUsers();

        res.render("dashboard", {

            sentPromos:
                stats.sent_promos,

            totalUsers:
                chats.length,

            uptime:
                process.uptime(),

            users,

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