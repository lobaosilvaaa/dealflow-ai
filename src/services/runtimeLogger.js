const axios = require('axios');

const webhookUrl = process.env.DISCORD_RUNTIME_WEBHOOK;

async function sendRuntimeLog(title, description, color = 5763719) {
    try {
        await axios.post(webhookUrl, {
            username: 'DealFlowAI Runtime',
            avatar_url:
                'https://raw.githubusercontent.com/lobaosilvaaa/dealflow-ai/main/src/assets/LogoDealFlowAI.png',

            embeds: [
                {
                    title,
                    description,
                    color,
                    timestamp: new Date().toISOString(),

                    footer: {
                        text: 'DealFlowAI Runtime Logs',
                    },
                },
            ],
        });
    } catch (error) {
        console.error('Runtime Logger Error:', error.message);
    }
}

module.exports = sendRuntimeLog;