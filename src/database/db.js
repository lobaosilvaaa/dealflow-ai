// 🚀 DealFlowAI Database Core

const sqlite3 =
    require("sqlite3").verbose();

const path =
    require("path");

const fs =
    require("fs");

// 🌎 Caminho banco
const DB_PATH =
    path.join(
        __dirname,
        "../../database.sqlite"
    );

// 📂 Garante diretório
const dbDirectory =
    path.dirname(DB_PATH);

if (

    !fs.existsSync(dbDirectory)

) {

    fs.mkdirSync(

        dbDirectory,

        {

            recursive: true

        }

    );

}

// 💾 Cria/abre banco
const db =
    new sqlite3.Database(

        DB_PATH,

        error => {

            if (error) {

                console.log(
                    "❌ Erro conexão SQLite:",
                    error.message
                );

                process.exit(1);

            }

            console.log(
                "💾 SQLite conectado"
            );

        }

    );

// 🚀 Performance SQLite
db.serialize(() => {

    // ⚡ WAL mode
    db.run(`
        PRAGMA journal_mode = WAL
    `);

    // ⚡ Foreign keys
    db.run(`
        PRAGMA foreign_keys = ON
    `);

    // ⚡ Timeout
    db.run(`
        PRAGMA busy_timeout = 5000
    `);

});

// 🚀 Inicialização banco
db.serialize(() => {

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

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        sent_promos INTEGER DEFAULT 0,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )

`, error => {

        if (error) {

            console.log(
                "❌ Erro tabela stats:",
                error.message
            );

        }

    });

    // 🚀 Migração defensiva
    db.all(

        `
    PRAGMA table_info(stats)
    `,

        [],

        (error, columns) => {

            if (error) {

                console.log(
                    "❌ Erro migration stats:",
                    error.message
                );

                return;

            }

            const columnNames =
                columns.map(
                    column => column.name
                );

            // ➕ created_at
            if (

                !columnNames.includes(
                    "created_at"
                )

            ) {

                db.run(`

                ALTER TABLE stats

                ADD COLUMN created_at
                DATETIME DEFAULT CURRENT_TIMESTAMP

            `);

                console.log(
                    "🚀 Coluna created_at adicionada"
                );

            }

            // ➕ updated_at
            if (

                !columnNames.includes(
                    "updated_at"
                )

            ) {

                db.run(`

                ALTER TABLE stats

                ADD COLUMN updated_at
                DATETIME DEFAULT CURRENT_TIMESTAMP

            `);

                console.log(
                    "🚀 Coluna updated_at adicionada"
                );

            }

            // 🚀 Bootstrap seguro
            db.get(

                `
            SELECT * FROM stats
            LIMIT 1
            `,

                [],

                (bootstrapError, row) => {

                    if (bootstrapError) {

                        console.log(
                            "❌ Erro bootstrap stats:",
                            bootstrapError.message
                        );

                        return;

                    }

                    // 📦 Cria somente se vazio
                    if (!row) {

                        db.run(

                            `
                        INSERT INTO stats (
                            sent_promos
                        )

                        VALUES (0)
                        `,

                            insertError => {

                                if (insertError) {

                                    console.log(
                                        "❌ Erro insert stats:",
                                        insertError.message
                                    );

                                    return;

                                }

                                console.log(
                                    "📈 Stats bootstrap criado"
                                );

                            }

                        );

                    }

                }

            );

        }

    );

    // 📜 Logs runtime
    db.run(`

        CREATE TABLE IF NOT EXISTS runtime_logs (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            level TEXT,

            message TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

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
                    `,

                    insertError => {

                        if (insertError) {

                            console.log(
                                "❌ Erro bootstrap:",
                                insertError.message
                            );

                            return;

                        }

                        console.log(
                            "📈 Stats bootstrap criado"
                        );

                    }

                );

            }

        }

    );

    // 📌 Índices performance
    db.run(`
        CREATE INDEX IF NOT EXISTS idx_chat_id
        ON chats(chat_id)
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_user_settings_chat_id
        ON user_settings(chat_id)
    `);

    console.log(
        "💾 Banco de dados inicializado"
    );

});

// 🚀 Graceful shutdown
process.on(

    "SIGINT",

    () => {

        db.close(error => {

            if (error) {

                console.log(
                    "❌ Erro fechamento SQLite:",
                    error.message
                );

                process.exit(1);

            }

            console.log(
                "💾 SQLite encerrado"
            );

            process.exit(0);

        });

    }

);

module.exports = db;