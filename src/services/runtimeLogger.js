const axios = require("axios");
const os = require("os");

const webhookUrl = process.env.DISCORD_RUNTIME_WEBHOOK;

async function sendRuntimeLog(
    title,
    description,
    color = 5763719,
    service = "core"
) {
    try {
        const uptimeSeconds = process.uptime();

        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);

        const uptime = `${hours}h ${minutes}m ${seconds}s`;

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
                            value: "healthy",
                            inline: true,
                        },
                        {
                            name: "⏱️ Uptime",
                            value: uptime,
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