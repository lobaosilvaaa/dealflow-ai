const sqlite3 = require("sqlite3").verbose();

// 💾 Cria/abre banco
const db = new sqlite3.Database("./database.sqlite");

// 🚀 Inicialização das tabelas
db.serialize(() => {

    // 📊 Chats registrados
    db.run(`
            CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id TEXT UNIQUE
        )
    `);

    // ⚙️ Configurações do usuário
    db.run(`
        CREATE TABLE IF NOT EXISTS user_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id TEXT UNIQUE,
            category TEXT DEFAULT 'geral',
            frequency INTEGER DEFAULT 60,
            active INTEGER DEFAULT 1
        )
    `);

    console.log("💾 Banco de dados inicializado");

});

module.exports = db;