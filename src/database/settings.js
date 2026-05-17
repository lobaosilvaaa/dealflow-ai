// 🚀 DealFlowAI Settings Database

const db =
    require("./db");

const {

    logger

} = require(
    "../services/logger"
);

// 🛡️ Validação Chat ID
function validateChatId(chatId) {

    return (

        typeof chatId === "string" &&
        chatId.trim().length > 0

    );

}

// 🛡️ Validação frequência
function validateFrequency(frequency) {

    return (

        typeof frequency === "number" &&
        frequency >= 1

    );

}

// 💾 Salvar configurações
function saveSettings(

    chatId,
    category,
    frequency,
    active = 1

) {

    return new Promise((resolve, reject) => {

        // 🛡️ Validações
        if (

            !validateChatId(chatId)

        ) {

            return reject(
                new Error(
                    "Chat ID inválido"
                )
            );

        }

        if (

            !validateFrequency(frequency)

        ) {

            return reject(
                new Error(
                    "Frequência inválida"
                )
            );

        }

        db.run(

            `
            INSERT INTO user_settings (

                chat_id,
                category,
                frequency,
                active,
                updated_at

            )

            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)

            ON CONFLICT(chat_id)

            DO UPDATE SET

                category = excluded.category,
                frequency = excluded.frequency,
                active = excluded.active,
                updated_at = CURRENT_TIMESTAMP
            `,

            [

                chatId,
                category || "geral",
                frequency,
                active

            ],

            function (error) {

                if (error) {

                    logger.error(
                        `Erro saveSettings: ${error.message}`
                    );

                    return reject(error);

                }

                logger.info(
                    `Configuração salva: ${chatId}`
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

// 📥 Buscar configurações
function getSettings(chatId) {

    return new Promise((resolve, reject) => {

        // 🛡️ Validação
        if (

            !validateChatId(chatId)

        ) {

            return reject(
                new Error(
                    "Chat ID inválido"
                )
            );

        }

        db.get(

            `
            SELECT *
            FROM user_settings
            WHERE chat_id = ?
            `,

            [chatId],

            (error, row) => {

                if (error) {

                    logger.error(
                        `Erro getSettings: ${error.message}`
                    );

                    return reject(error);

                }

                resolve(row || null);

            }

        );

    });

}

// 👥 Buscar todos usuários
function getAllUsers() {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT *
            FROM user_settings
            ORDER BY updated_at DESC
            `,

            [],

            (error, rows) => {

                if (error) {

                    logger.error(
                        `Erro getAllUsers: ${error.message}`
                    );

                    return reject(error);

                }

                resolve(rows || []);

            }

        );

    });

}

// ⏸️ Pausar usuário
function pauseUser(chatId) {

    return new Promise((resolve, reject) => {

        // 🛡️ Validação
        if (

            !validateChatId(chatId)

        ) {

            return reject(
                new Error(
                    "Chat ID inválido"
                )
            );

        }

        db.run(

            `
            UPDATE user_settings

            SET

                active = 0,
                updated_at = CURRENT_TIMESTAMP

            WHERE chat_id = ?
            `,

            [chatId],

            function (error) {

                if (error) {

                    logger.error(
                        `Erro pauseUser: ${error.message}`
                    );

                    return reject(error);

                }

                logger.warn(
                    `Usuário pausado: ${chatId}`
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

// ▶️ Ativar usuário
function activateUser(chatId) {

    return new Promise((resolve, reject) => {

        // 🛡️ Validação
        if (

            !validateChatId(chatId)

        ) {

            return reject(
                new Error(
                    "Chat ID inválido"
                )
            );

        }

        db.run(

            `
            UPDATE user_settings

            SET

                active = 1,
                updated_at = CURRENT_TIMESTAMP

            WHERE chat_id = ?
            `,

            [chatId],

            function (error) {

                if (error) {

                    logger.error(
                        `Erro activateUser: ${error.message}`
                    );

                    return reject(error);

                }

                logger.info(
                    `Usuário ativado: ${chatId}`
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

// 🗑️ Remover usuário
function deleteUser(chatId) {

    return new Promise((resolve, reject) => {

        // 🛡️ Validação
        if (

            !validateChatId(chatId)

        ) {

            return reject(
                new Error(
                    "Chat ID inválido"
                )
            );

        }

        db.run(

            `
            DELETE FROM user_settings
            WHERE chat_id = ?
            `,

            [chatId],

            function (error) {

                if (error) {

                    logger.error(
                        `Erro deleteUser: ${error.message}`
                    );

                    return reject(error);

                }

                logger.warn(
                    `Usuário removido: ${chatId}`
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

// 📊 Total usuários
function getUsersCount() {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT COUNT(*) as total
            FROM user_settings
            `,

            [],

            (error, row) => {

                if (error) {

                    logger.error(
                        `Erro getUsersCount: ${error.message}`
                    );

                    return reject(error);

                }

                resolve(
                    row?.total || 0
                );

            }

        );

    });

}

module.exports = {

    saveSettings,

    getSettings,

    getAllUsers,

    pauseUser,

    activateUser,

    deleteUser,

    getUsersCount,

};