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

// 📊 Estatísticas
async function stats(req, res) {

    try {

        const data =
            await getStats();

        const chats =
            await getChats();

        res.json({

            success: true,

            stats: {

                sentPromos:
                    data.sent_promos,

                totalUsers:
                    chats.length,

                uptime:
                    process.uptime(),

            }

        });

    } catch (error) {

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

            users,

        });

    } catch (error) {

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

        const logPath = path.join(
            __dirname,
            "../logs/app.log"
        );

        let logs = [];

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

            logs,

        });

    } catch (error) {

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