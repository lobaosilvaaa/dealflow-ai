const db =
    require("./db");

// 💾 Salvar chat
function saveChat(chatId) {

    return new Promise((resolve, reject) => {

        db.run(

            `
      INSERT OR IGNORE INTO chats (
        chat_id
      )

      VALUES (?)
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

                    return reject(error);

                }

                resolve(rows);

            }

        );

    });

}

// 🔍 Buscar chat específico
function getChat(chatId) {

    return new Promise((resolve, reject) => {

        db.get(

            `
      SELECT *
      FROM chats
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

// 🗑️ Remover chat
function deleteChat(chatId) {

    return new Promise((resolve, reject) => {

        db.run(

            `
      DELETE FROM chats
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

    saveChat,

    getAllChats,

    getChat,

    deleteChat,

};