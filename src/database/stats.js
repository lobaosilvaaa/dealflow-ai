const db =
    require("./db");

// 📈 Inicializa tabela stats
db.run(`

    CREATE TABLE IF NOT EXISTS stats (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        sent_promos INTEGER DEFAULT 0

    )

`);

// 🚀 Bootstrap inicial
db.get(

    `
    SELECT * FROM stats
    WHERE id = 1
    `,

    (error, row) => {

        if (error) {

            console.log(
                "❌ Erro stats bootstrap:",
                error.message
            );

            return;

        }

        // 📦 Cria linha inicial
        if (!row) {

            db.run(`

                INSERT INTO stats (

                    id,
                    sent_promos

                )

                VALUES (

                    1,
                    0

                )

            `);

            console.log(
                "📈 Stats inicializado"
            );

        }

    }

);

// ➕ Incrementa promoções
function incrementPromos() {

    return new Promise((resolve, reject) => {

        db.run(`

            UPDATE stats

            SET sent_promos =
                sent_promos + 1

            WHERE id = 1

        `,

            error => {

                if (error) {

                    return reject(error);

                }

                resolve();

            }

        );

    });

}

// 📊 Busca estatísticas
function getStats() {

    return new Promise((resolve, reject) => {

        db.get(`

            SELECT sent_promos

            FROM stats

            WHERE id = 1

        `,

            (error, row) => {

                if (error) {

                    return reject(error);

                }

                // 🛡️ Fallback defensivo
                resolve(row || {

                    sent_promos: 0

                });

            }

        );

    });

}

module.exports = {

    incrementPromos,

    getStats,

};