const db = require("./db");

// 💾 Adiciona chat no banco (ignora se já existir)
function addChat(chatId) {
    db.run(
        "INSERT OR IGNORE INTO chats (chat_id) VALUES (?)",
        [chatId],
        (err) => {
            if (err) {
                console.error("❌ Erro ao salvar chat:", err.message);
            } else {
                console.log("💾 Chat salvo:", chatId);
            }
        }
    );
}

// 📊 Retorna todos os chats (agora assíncrono)
function getChats() {
    return new Promise((resolve, reject) => {
        db.all("SELECT chat_id FROM chats", [], (err, rows) => {
            if (err) {
                console.error("❌ Erro ao buscar chats:", err.message);
                reject(err);
            } else {
                const chatIds = rows.map((row) => row.chat_id);
                resolve(chatIds);
            }
        });
    });
}

module.exports = {
    addChat,
    getChats,
};