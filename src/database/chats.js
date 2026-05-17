// 🚀 DealFlowAI Chats Database

const db =
    require("./db");

const {
    logger
} = require(
    "../services/logger"
);

// 💾 Salvar chat
function saveChat(chatId) {

    return new Promise((resolve, reject) => {

        // 🛡️ Validação
        if (

            !chatId ||
            typeof chatId !== "string"

        ) {

            logger.warn(
                "Tentativa salvar chat inválido"
            );

            return reject(
                new Error(
                    "Chat ID inválido"
                )
            );

        }

        db.run(

            `
            INSERT OR IGNORE INTO chats (

                chat_id

            )

            VALUES (?)
            `,

            [chatId],

            function (error) {

                if (error) {

                    logger.error(
                        `Erro saveChat: ${error.message}`
                    );

                    return reject(error);

                }

                logger.info(
                    `Chat salvo: ${chatId}`
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

// 📥 Buscar todos chats
function getAllChats() {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT *
            FROM chats
            ORDER BY rowid DESC
            `,

            [],

            (error, rows) => {

                if (error) {

                    logger.error(
                        `Erro getAllChats: ${error.message}`
                    );

                    return reject(error);

                }

                resolve(rows || []);

            }

        );

    });

}

// 🔍 Buscar chat específico
function getChat(chatId) {

    return new Promise((resolve, reject) => {

        // 🛡️ Validação
        if (

            !chatId ||
            typeof chatId !== "string"

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
            FROM chats
            WHERE chat_id = ?
            `,

            [chatId],

            (error, row) => {

                if (error) {

                    logger.error(
                        `Erro getChat: ${error.message}`
                    );

                    return reject(error);

                }

                resolve(row || null);

            }

        );

    });

}

// 🗑️ Remover chat
function deleteChat(chatId) {

    return new Promise((resolve, reject) => {

        // 🛡️ Validação
        if (

            !chatId ||
            typeof chatId !== "string"

        ) {

            return reject(
                new Error(
                    "Chat ID inválido"
                )
            );

        }

        db.run(

            `
            DELETE FROM chats
            WHERE chat_id = ?
            `,

            [chatId],

            function (error) {

                if (error) {

                    logger.error(
                        `Erro deleteChat: ${error.message}`
                    );

                    return reject(error);

                }

                logger.warn(
                    `Chat removido: ${chatId}`
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

// 📊 Total chats
function getChatsCount() {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT COUNT(*) as total
            FROM chats
            `,

            [],

            (error, row) => {

                if (error) {

                    logger.error(
                        `Erro getChatsCount: ${error.message}`
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

    saveChat,

    getAllChats,

    getChat,

    deleteChat,

    getChatsCount,

};