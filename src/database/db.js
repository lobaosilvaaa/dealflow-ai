const sqlite3 =
    require("sqlite3").verbose();

// 💾 Cria/abre banco
const db =
    new sqlite3.Database(
        "./database.sqlite"
    );

// 🚀 Inicialização banco
db.serialize(() => {

    // 📊 Chats registrados
    db.run(`

        CREATE TABLE IF NOT EXISTS chats (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            chat_id TEXT UNIQUE

        )

    `);

    // ⚙️ Configurações usuários
    db.run(`

        CREATE TABLE IF NOT EXISTS user_settings (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            chat_id TEXT UNIQUE,

            category TEXT DEFAULT 'geral',

            frequency INTEGER DEFAULT 1,

            active INTEGER DEFAULT 1

        )

    `);

    // 📈 Estatísticas globais
    db.run(`

        CREATE TABLE IF NOT EXISTS stats (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            sent_promos INTEGER DEFAULT 0

        )

    `);

    // 🚀 Bootstrap stats
    db.get(

        `
        SELECT * FROM stats
        LIMIT 1
        `,

        [],

        (error, row) => {

            if (error) {

                console.log(
                    "❌ Erro stats:",
                    error.message
                );

                return;

            }

            // 📦 Cria registro inicial
            if (!row) {

                db.run(

                    `
                    INSERT INTO stats (
                        sent_promos
                    )

                    VALUES (0)
                    `

                );

                console.log(
                    "📈 Stats bootstrap criado"
                );

            }

        }

    );

    console.log(
        "💾 Banco de dados inicializado"
    );

});

module.exports = db;