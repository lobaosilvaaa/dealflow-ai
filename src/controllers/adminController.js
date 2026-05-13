const {

    pauseUser,
    activateUser,
    deleteUser,

} = require(
    "../database/settings"
);

const {
    logger
} = require(
    "../services/logger"
);

// ⏸️ Pausar usuário
async function pause(req, res) {

    try {

        const {
            chatId
        } = req.params;

        await pauseUser(chatId);

        logger.info(
            `Usuário pausado: ${chatId}`
        );

        res.redirect(
            "/dashboard"
        );

    } catch (error) {

        logger.error(
            `Erro ao pausar usuário: ${error.message}`
        );

        res.send(
            "❌ Erro ao pausar usuário"
        );

    }

}

// ▶️ Ativar usuário
async function activate(req, res) {

    try {

        const {
            chatId
        } = req.params;

        await activateUser(chatId);

        logger.info(
            `Usuário ativado: ${chatId}`
        );

        res.redirect(
            "/dashboard"
        );

    } catch (error) {

        logger.error(
            `Erro ao ativar usuário: ${error.message}`
        );

        res.send(
            "❌ Erro ao ativar usuário"
        );

    }

}

// 🗑️ Remover usuário
async function remove(req, res) {

    try {

        const {
            chatId
        } = req.params;

        await deleteUser(chatId);

        logger.info(
            `Usuário removido: ${chatId}`
        );

        res.redirect(
            "/dashboard"
        );

    } catch (error) {

        logger.error(
            `Erro ao remover usuário: ${error.message}`
        );

        res.send(
            "❌ Erro ao remover usuário"
        );

    }

}

module.exports = {

    pause,

    activate,

    remove,

};