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

module.exports = {
    setCategory,
    getCategory,
    setFrequency,
    getFrequency,
};