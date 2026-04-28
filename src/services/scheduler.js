const { getChats } = require("../database/chats");
const { processMessage } = require("../core/bot");

function startScheduler(bot) {
    console.log("⏰ Scheduler iniciado...");

    setInterval(async () => {
        try {
            const chats = await getChats();

            if (!chats || chats.length === 0) {
                console.log("⚠️ Nenhum chat no banco");
                return;
            }

            console.log(`📊 Enviando para ${chats.length} chat(s)...`);

            for (const chatId of chats) {
                try {
                    // 🧠 Gera mensagem via core
                    const mensagem = await processMessage(chatId, "promo");

                    // 📤 Envia mensagem
                    await bot.telegram.sendMessage(chatId, mensagem);

                    console.log("📤 Enviado para:", chatId);
                } catch (err) {
                    console.error(
                        `❌ Erro ao enviar para ${chatId}:`,
                        err.message
                    );
                }
            }
        } catch (error) {
            console.error("❌ Erro no scheduler:", error.message);
        }
    }, 60000); // ⏱️ 1 minuto (ajustável)
}

module.exports = {
    startScheduler,
};