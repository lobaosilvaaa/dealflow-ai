// 🚀 DealFlowAI Stats Service

const db =
    require("./db");

const {

    logger

} = require(
    "../services/logger"
);

// ➕ Incrementa promoções
function incrementPromos() {

    return new Promise((resolve, reject) => {

        db.run(`

            UPDATE stats

            SET

                sent_promos =
                    sent_promos + 1,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id = 1

        `,

            error => {

                if (error) {

                    logger.error(

                        `Erro incrementPromos: ${error.message}`

                    );

                    return reject(error);

                }

                logger.info(
                    "Promo incrementada"
                );

                resolve();

            }

        );

    });

}

// 📊 Busca estatísticas
function getStats() {

    return new Promise((resolve, reject) => {

        db.get(`

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
                resolve(row || {

                    sent_promos: 0,

                    created_at: null,

                    updated_at: null

                });

            }

        );

    });

}

// 🔄 Reset estatísticas
function resetStats() {

    return new Promise((resolve, reject) => {

        db.run(`

            UPDATE stats

            SET

                sent_promos = 0,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id = 1

        `,

            error => {

                if (error) {

                    logger.error(

                        `Erro resetStats: ${error.message}`

                    );

                    return reject(error);

                }

                logger.warn(
                    "Stats resetado"
                );

                resolve();

            }

        );

    });

}

module.exports = {

    incrementPromos,

    getStats,

    resetStats,

};