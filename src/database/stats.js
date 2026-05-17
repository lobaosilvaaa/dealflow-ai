// 🚀 DealFlowAI Stats Database

const db =
    require("./db");

const {
    logger
} = require(
    "../services/logger"
);

// 📈 Inicializa tabela stats
db.run(`

    CREATE TABLE IF NOT EXISTS stats (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        sent_promos INTEGER DEFAULT 0,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )

`, error => {

    if (error) {

        logger.error(
            `Erro criar tabela stats: ${error.message}`
        );

        return;

    }

    logger.info(
        "Tabela stats validada"
    );

});

// 🚀 Bootstrap inicial
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
                `Erro stats bootstrap: ${error.message}`
            );

            console.log(
                "❌ Erro stats bootstrap:",
                error.message
            );

            return;

        }

        // 📦 Cria linha inicial
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

                bootstrapError => {

                    if (bootstrapError) {

                        logger.error(
                            `Erro bootstrap stats: ${bootstrapError.message}`
                        );

                        return;

                    }

                    logger.info(
                        "📈 Stats inicializado"
                    );

                    console.log(
                        "📈 Stats inicializado"
                    );

                }

            );

        }

    }

);

// ➕ Incrementa promoções
function incrementPromos() {

    return new Promise((resolve, reject) => {

        db.run(

            `

            UPDATE stats

            SET

                sent_promos =
                    sent_promos + 1,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id = 1

            `,

            function (error) {

                if (error) {

                    logger.error(
                        `Erro incrementPromos: ${error.message}`
                    );

                    return reject(error);

                }

                logger.info(
                    "Promo incrementada"
                );

                resolve({

                    success: true,

                    changes:
                        this.changes

                });

            }

        );

    });

}

// 📊 Busca estatísticas
function getStats() {

    return new Promise((resolve, reject) => {

        db.get(

            `

            SELECT

                sent_promos,
                created_at,
                updated_at

            FROM stats

            WHERE id = 1

            `,

            [],

            (error, row) => {

                if (error) {

                    logger.error(
                        `Erro getStats: ${error.message}`
                    );

                    return reject(error);

                }

                // 🛡️ Fallback defensivo
                resolve(

                    row || {

                        sent_promos: 0,

                        created_at: null,

                        updated_at: null

                    }

                );

            }

        );

    });

}

// 🔄 Reset estatísticas
function resetStats() {

    return new Promise((resolve, reject) => {

        db.run(

            `

            UPDATE stats

            SET

                sent_promos = 0,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = 1

            `,

            function (error) {

                if (error) {

                    logger.error(
                        `Erro resetStats: ${error.message}`
                    );

                    return reject(error);

                }

                logger.warn(
                    "Stats resetado"
                );

                resolve({

                    success: true,

                    changes:
                        this.changes

                });

            }

        );

    });

}

module.exports = {

    incrementPromos,

    getStats,

    resetStats,

};