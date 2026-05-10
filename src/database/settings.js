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

module.exports = {
    setCategory,
    getCategory,
};