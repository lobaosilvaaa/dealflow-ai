const axios = require("axios");
const os = require("os");

const webhookUrl = process.env.DISCORD_RUNTIME_WEBHOOK;

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;

    return `${s}s`;
}

function getMemoryUsage() {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    return `${Math.round(used)} MB`;
}

function getStatusInfo(status) {
    switch (status) {
        case "healthy":
            return {
                emoji: "🟢 Healthy",
                color: 5763719,
            };

        case "warning":
            return {
                emoji: "🟡 Warning",
                color: 16776960,
            };

        case "offline":
            return {
                emoji: "🔴 Offline",
                color: 15548997,
            };

        default:
            return {
                emoji: "⚪ Unknown",
                color: 9807270,
            };
    }
}

async function sendRuntimeLog(
    title,
    description,
    service = "core",
    status = "healthy",
    category = "⚙️ System Events"
) {
    try {
        const uptime = formatUptime(process.uptime());

        const memoryUsage = getMemoryUsage();

        const statusInfo = getStatusInfo(status);

        // ⚠️ Memory alert
        const memoryValue = parseInt(memoryUsage);

        let memoryStatus = "✅ Normal";

        if (memoryValue >= 200) {
            memoryStatus = "⚠️ High";
        }

        await axios.post(webhookUrl, {
            username: "DealFlowAI Runtime",

            avatar_url:
                "https://raw.githubusercontent.com/lobaosilvaaa/dealflow-ai/main/src/assets/LogoDealFlowAI.png",

            embeds: [
                {
                    title,
                    description,

                    color: statusInfo.color,

                    fields: [
                        {
                            name: "📂 Category",
                            value: category,
                            inline: true,
                        },
                        {
                            name: "🖥️ Environment",
                            value:
                                process.env.NODE_ENV || "development",
                            inline: true,
                        },
                        {
                            name: "⚙️ Service",
                            value: service,
                            inline: true,
                        },
                        {
                            name: "📡 Status",
                            value: statusInfo.emoji,
                            inline: true,
                        },
                        {
                            name: "⏱️ Uptime",
                            value: uptime,
                            inline: true,
                        },
                        {
                            name: "💾 Memory",
                            value: `${memoryUsage} (${memoryStatus})`,
                            inline: true,
                        },
                        {
                            name: "💻 Host",
                            value: os.hostname(),
                            inline: true,
                        },
                        {
                            name: "🕒 Started At",
                            value: new Date().toLocaleString(),
                            inline: true,
                        },
                    ],

                    footer: {
                        text: "DealFlowAI Runtime Logs",
                    },

                    timestamp: new Date().toISOString(),
                },
            ],
        });
    } catch (error) {
        console.error("❌ Runtime Logger Error:", error.message);
    }
}

module.exports = sendRuntimeLog;