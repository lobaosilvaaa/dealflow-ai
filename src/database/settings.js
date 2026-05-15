const db =
    require("./db");

// 💾 Salvar configurações
function saveSettings(

    chatId,
    category,
    frequency,
    active = 1

) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            INSERT OR REPLACE INTO user_settings (

                chat_id,
                category,
                frequency,
                active

            )

            VALUES (?, ?, ?, ?)
            `,

            [

                chatId,
                category,
                frequency,
                active

            ],

            error => {

                if (error) {

                    return reject(error);

                }

                resolve();

            }

        );

    });

}

// 📥 Buscar configurações
function getSettings(chatId) {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT *
            FROM user_settings
            WHERE chat_id = ?
            `,

            [chatId],

            (error, row) => {

                if (error) {

                    return reject(error);

                }

                resolve(row);

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
            ORDER BY rowid DESC
            `,

            [],

            (error, rows) => {

                if (error) {

                    return reject(error);

                }

                resolve(rows);

            }

        );

    });

}

// ⏸️ Pausar usuário
function pauseUser(chatId) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE user_settings
            SET active = 0
            WHERE chat_id = ?
            `,

            [chatId],

            error => {

                if (error) {

                    return reject(error);

                }

                resolve();

            }

        );

    });

}

// ▶️ Ativar usuário
function activateUser(chatId) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE user_settings
            SET active = 1
            WHERE chat_id = ?
            `,

            [chatId],

            error => {

                if (error) {

                    return reject(error);

                }

                resolve();

            }

        );

    });

}

// 🗑️ Remover usuário
function deleteUser(chatId) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            DELETE FROM user_settings
            WHERE chat_id = ?
            `,

            [chatId],

            error => {

                if (error) {

                    return reject(error);

                }

                resolve();

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

};