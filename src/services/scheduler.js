const { getChats } = require("../database/chats");
const { processMessage } = require("../core/bot");

function startScheduler(bot) {
    console.log("⏰ Scheduler iniciado...");

    setInterval(async () => {
        try {
            const chats = getChats();

            if (chats.length === 0) {
                console.log("⚠️ Nenhum chat registrado ainda");
                return;
            }

            console.log(`📊 Enviando para ${chats.length} chat(s)...`);

            for (const chatId of chats) {
                try {
                    // 🔥 Aqui usamos o core para gerar a mensagem
                    const mensagem = await processMessage(chatId, "promo");

                    await bot.telegram.sendMessage(chatId, mensagem);

                    console.log("📤 Enviado para:", chatId);
                } catch (err) {
                    console.error("❌ Erro ao enviar para", chatId, err.message);
                }
            }
        } catch (error) {
            console.error("❌ Erro no scheduler:", error.message);
        }
    }, 60000); // 1 minuto (teste)

}

module.exports = { startScheduler };