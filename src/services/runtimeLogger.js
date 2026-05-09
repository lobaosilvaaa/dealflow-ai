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

async function sendRuntimeLog(
    title,
    description,
    color = 5763719,
    service = "core",
    status = "healthy"
) {
    try {
        const uptime = formatUptime(process.uptime());

        const statusEmoji =
            status === "healthy"
                ? "🟢 Healthy"
                : status === "warning"
                ? "🟡 Warning"
                : "🔴 Offline";

        await axios.post(webhookUrl, {
            username: "DealFlowAI Runtime",

            avatar_url:
                "https://raw.githubusercontent.com/lobaosilvaaa/dealflow-ai/main/src/assets/LogoDealFlowAI.png",

            embeds: [
                {
                    title,
                    description,
                    color,

                    fields: [
                        {
                            name: "🖥️ Environment",
                            value: process.env.NODE_ENV || "development",
                            inline: true,
                        },
                        {
                            name: "⚙️ Service",
                            value: service,
                            inline: true,
                        },
                        {
                            name: "📡 Status",
                            value: statusEmoji,
                            inline: true,
                        },
                        {
                            name: "⏱️ Uptime",
                            value: uptime,
                            inline: true,
                        },
                        {
                            name: "💾 Memory",
                            value: getMemoryUsage(),
                            inline: true,
                        },
                        {
                            name: "💻 Host",
                            value: os.hostname(),
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