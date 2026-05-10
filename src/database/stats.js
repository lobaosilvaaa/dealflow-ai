const db = require("./db");

// 🚀 Inicializa tabela
db.run(`
    CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sent_promos INTEGER DEFAULT 0
    )
`);

// 📌 Garante linha inicial
db.get("SELECT * FROM stats WHERE id = 1", (err, row) => {

    if (!row) {

        db.run(`
            INSERT INTO stats (id, sent_promos)
            VALUES (1, 0)
        `);

    }

});

// ➕ Incrementa promoções
function incrementPromos() {

    db.run(`
        UPDATE stats
        SET sent_promos = sent_promos + 1
        WHERE id = 1
    `);

}

// 📊 Busca estatísticas
function getStats() {

    return new Promise((resolve, reject) => {

        db.get(`
            SELECT sent_promos
            FROM stats
            WHERE id = 1
    `, (err, row) => {

            if (err) {
                reject(err);
            } else {
                resolve(row);
            }

        });

    });

}

module.exports = {
    incrementPromos,
    getStats,
};