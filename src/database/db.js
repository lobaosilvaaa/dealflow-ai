// 🚀 DealFlowAI Database Core

const sqlite3 =
    require("sqlite3").verbose();

const path =
    require("path");

const fs =
    require("fs");

const {

    logger

} = require(
    "../services/logger"
);

// 📂 Caminho banco
const databasePath =
    path.join(

        __dirname,

        "../../database.sqlite"

    );

// 📂 Verifica banco
const databaseExists =
    fs.existsSync(
        databasePath
    );

// 💾 Cria/abre banco
const db =
    new sqlite3.Database(

        databasePath,

        error => {

            if (error) {

                console.log(
                    "❌ Erro SQLite:",
                    error.message
                );

                return;

            }

            console.log(
                "💾 SQLite conectado"
            );

        }

    );

// 🚀 Inicialização banco
db.serialize(() => {

    logger.info(
        "Inicializando banco de dados..."
    );

    // 📊 Chats registrados
    db.run(`

        CREATE TABLE IF NOT EXISTS chats (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            chat_id TEXT UNIQUE NOT NULL,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )

    `);

    // ⚙️ Configurações usuários
    db.run(`

        CREATE TABLE IF NOT EXISTS user_settings (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            chat_id TEXT UNIQUE NOT NULL,

            category TEXT DEFAULT 'geral',

            frequency INTEGER DEFAULT 1,

            active INTEGER DEFAULT 1,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )

    `);

    // 📈 Estatísticas globais
    db.run(`

        CREATE TABLE IF NOT EXISTS stats (

            id INTEGER PRIMARY KEY,

            sent_promos INTEGER DEFAULT 0,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )

    `);

    logger.info(
        "Tabela stats validada"
    );

    // 🚀 Bootstrap stats
    db.get(

        `
        SELECT *
        FROM stats
        WHERE id = 1
        `,

        [],

        (error, row) => {

            if (error) {

                logger.error(

                    `Erro bootstrap stats: ${error.message}`

                );

                return;

            }

            // 📦 Registro inicial
            if (!row) {

                db.run(

                    `
                    INSERT INTO stats (

                        id,
                        sent_promos

                    )

                    VALUES (

                        1,
                        0

                    )
                    `,

                    insertError => {

                        if (insertError) {

                            logger.error(

                                `Erro insert stats: ${insertError.message}`

                            );

                            return;

                        }

                        logger.info(
                            "Stats bootstrap criado"
                        );

                    }

                );

            }

        }

    );

    // ⚡ Performance
    db.run(
        "PRAGMA journal_mode = WAL"
    );

    db.run(
        "PRAGMA synchronous = NORMAL"
    );

    db.run(
        "PRAGMA foreign_keys = ON"
    );

    logger.info(
        "Banco de dados inicializado"
    );

});

// 🛑 Fecha banco
function closeDatabase() {

    db.close(error => {

        if (error) {

            logger.error(
                `Erro fechamento SQLite: ${error.message}`
            );

            return;

        }

        logger.warn(
            "SQLite desconectado"
        );

    });

}

module.exports = db;