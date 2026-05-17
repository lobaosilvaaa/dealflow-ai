// 🚀 DealFlowAI Runtime Logger

const axios =
    require("axios");

const os =
    require("os");

const fs =
    require("fs");

const path =
    require("path");

// 🌐 Webhook
const webhookUrl =
    process.env.DISCORD_RUNTIME_WEBHOOK;

// 📂 Logs runtime
const runtimeLogPath =
    path.join(

        __dirname,

        "../logs/runtime.log"

    );

// 📂 Garante diretório
const logsDir =
    path.dirname(
        runtimeLogPath
    );

if (

    !fs.existsSync(logsDir)

) {

    fs.mkdirSync(

        logsDir,

        {

            recursive: true

        }

    );

}

// ⏱️ Formata uptime
function formatUptime(seconds) {

    const h =
        Math.floor(seconds / 3600);

    const m =
        Math.floor(

            (seconds % 3600) / 60

        );

    const s =
        Math.floor(seconds % 60);

    if (h > 0) {

        return `${h}h ${m}m`;

    }

    if (m > 0) {

        return `${m}m ${s}s`;

    }

    return `${s}s`;

}

// 💾 Uso memória
function getMemoryUsage() {

    const used =
        process.memoryUsage()
            .heapUsed
        / 1024
        / 1024;

    return Math.round(used);

}

// ⚡ CPU usage
function getCpuUsage() {

    const load =
        os.loadavg()[0];

    return `${load.toFixed(2)}%`;

}

// ✂️ Limita texto
function truncate(

    text,
    max = 1000

) {

    if (!text) {

        return "N/A";

    }

    return text.length > max

        ? text.substring(0, max) + "..."

        : text;

}

// 🎨 Status runtime
function getStatusInfo(status) {

    switch (status) {

        case "healthy":

            return {

                emoji:
                    "🟢 Operational",

                color:
                    5763719,

            };

        case "warning":

            return {

                emoji:
                    "🟡 Warning",

                color:
                    16776960,

            };

        case "offline":

            return {

                emoji:
                    "🔴 Offline",

                color:
                    15548997,

            };

        case "error":

            return {

                emoji:
                    "❌ Error",

                color:
                    15158332,

            };

        default:

            return {

                emoji:
                    "⚪ Unknown",

                color:
                    9807270,

            };

    }

}

// 💾 Salva runtime local
function saveRuntimeFile(

    title,
    description,
    status

) {

    try {

        const line = `

[${new Date().toISOString()}]
[${status.toUpperCase()}]
${title}

${description}

━━━━━━━━━━━━━━━━━━

`;

        fs.appendFileSync(

            runtimeLogPath,

            line

        );

    } catch (error) {

        console.log(

            "❌ Runtime file error:",

            error.message

        );

    }

}

// 🚀 Runtime Logger principal
async function sendRuntimeLog(

    title,
    description,
    service = "core",
    status = "healthy",
    category = "⚙️ System Events",
    latency = null

) {

    try {

        // 💾 Runtime local
        saveRuntimeFile(

            title,
            description,
            status

        );

        // 🛡️ Webhook obrigatório
        if (!webhookUrl) {

            console.log(
                "⚠️ DISCORD_RUNTIME_WEBHOOK ausente"
            );

            return;

        }

        const uptime =
            formatUptime(
                process.uptime()
            );

        const memoryUsage =
            getMemoryUsage();

        const cpuUsage =
            getCpuUsage();

        const statusInfo =
            getStatusInfo(status);

        // ⚠️ Memory Alert
        let memoryStatus =
            "✅ Normal";

        if (

            memoryUsage >= 200

        ) {

            memoryStatus =
                "⚠️ High";

        }

        // 🚀 Payload Discord
        await axios.post(

            webhookUrl,

            {

                username:
                    "DealFlowAI Runtime",

                avatar_url:
                    "https://raw.githubusercontent.com/lobaosilvaaa/dealflow-ai/main/src/assets/LogoDealFlowAI.png",

                embeds: [

                    {

                        author: {

                            name:
                                "DealFlowAI Runtime",

                            icon_url:
                                "https://raw.githubusercontent.com/lobaosilvaaa/dealflow-ai/main/src/assets/LogoDealFlowAI.png",

                        },

                        title,

                        description:
                            truncate(description),

                        color:
                            statusInfo.color,

                        fields: [

                            {

                                name:
                                    "📡 Status",

                                value:
                                    statusInfo.emoji,

                                inline: true,

                            },

                            {

                                name:
                                    "⚙️ Service",

                                value:
                                    service,

                                inline: true,

                            },

                            {

                                name:
                                    "🖥️ Environment",

                                value:

                                    process.env.NODE_ENV === "production"

                                        ? "PROD"

                                        : "DEV",

                                inline: true,

                            },

                            {

                                name:
                                    "💾 Performance",

                                value:
                                    `${memoryUsage} MB • ${cpuUsage}`,

                                inline: true,

                            },

                            {

                                name:
                                    "🧠 Memory Status",

                                value:
                                    memoryStatus,

                                inline: true,

                            },

                            {

                                name:
                                    "⏱️ Runtime",

                                value:

                                    `Up: ${uptime} • ${latency
                                        ? `${latency}ms`
                                        : "N/A"
                                    }`,

                                inline: true,

                            },

                            {

                                name:
                                    "📂 Category",

                                value:
                                    category,

                                inline: true,

                            },

                            {

                                name:
                                    "💻 Host",

                                value:
                                    os.hostname(),

                                inline: false,

                            },

                            {

                                name:
                                    "🟢 Node",

                                value:
                                    process.version,

                                inline: true,

                            }

                        ],

                        footer: {

                            text:
                                "DealFlowAI Runtime Logs",

                        },

                        timestamp:
                            new Date().toISOString(),

                    }

                ],

            }

        );

    } catch (error) {

        console.error(

            "❌ Runtime Logger Error:",

            error.message

        );

    }

}

module.exports =
    sendRuntimeLog;