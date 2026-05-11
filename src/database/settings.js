const db = require("./db");

function setCategory(chatId, category) {
    db.run(`
        INSERT INTO user_settings (chat_id, category)
        VALUES (?, ?)
        ON CONFLICT(chat_id)
        DO UPDATE SET category=excluded.category
    `, [chatId, category]);
}

function getCategory(chatId) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT category FROM user_settings WHERE chat_id = ?",
            [chatId],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.category : "geral");
                }
            }
        );
    });
}

function setFrequency(chatId, frequency) {

    db.run(`
        INSERT INTO user_settings (chat_id, frequency)
        VALUES (?, ?)
        ON CONFLICT(chat_id)
        DO UPDATE SET frequency=excluded.frequency
    `, [chatId, frequency]);

}

function getFrequency(chatId) {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT frequency FROM user_settings WHERE chat_id = ?",
            [chatId],
            (err, row) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.frequency : 60);
                }

            }
        );

    });

}

function setActive(chatId, active) {

    db.run(`
        INSERT INTO user_settings (chat_id, active)
        VALUES (?, ?)
        ON CONFLICT(chat_id)
        DO UPDATE SET active=excluded.active
    `, [chatId, active]);

}

function isActive(chatId) {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT active FROM user_settings WHERE chat_id = ?",
            [chatId],
            (err, row) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.active === 1 : true);
                }

            }
        );

    });

}

function getAllUsers() {

    return new Promise((resolve, reject) => {

        db.all(`
        SELECT
            chat_id,
            category,
            frequency,
            active
        FROM user_settings
        `, [], (err, rows) => {

        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }

        });

    });

}

function updateUserStatus(chatId, active) {

    db.run(`
        UPDATE user_settings
        SET active = ?
        WHERE chat_id = ?
    `, [active, chatId]);

}

function deleteUser(chatId) {

    db.run(`
        DELETE FROM user_settings
        WHERE chat_id = ?
    `, [chatId]);

}

module.exports = {
    setCategory,
    getCategory,
    setFrequency,
    getFrequency,
    setActive,
    isActive,
    getAllUsers,
    updateUserStatus,
    deleteUser
};