const {

    updateUserStatus,
    deleteUser,

} = require(
    "../database/settings"
);

const logger =
    require("../services/logger");

// ▶️ Ativar usuário
function activate(req, res) {

    const chatId =
        req.params.chatId;

    updateUserStatus(
        chatId,
        1
    );

    logger.info(
        `Usuário ativado: ${chatId}`
    );

    res.redirect(
        "/dashboard"
    );

}

// ⏸️ Pausar usuário
function pause(req, res) {

    const chatId =
        req.params.chatId;

    updateUserStatus(
        chatId,
        0
    );

    logger.info(
        `Usuário pausado: ${chatId}`
    );

    res.redirect(
        "/dashboard"
    );

}

// 🗑️ Remover usuário
function remove(req, res) {

    const chatId =
        req.params.chatId;

    deleteUser(chatId);

    logger.info(
        `Usuário removido: ${chatId}`
    );

    res.redirect(
        "/dashboard"
    );

}

module.exports = {

    activate,

    pause,

    remove,

};