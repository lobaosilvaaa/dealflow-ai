// 🚀 DealFlowAI Admin Controller

const {

    pauseUser,
    activateUser,
    deleteUser,

} = require(
    "../database/settings"
);

const {

    logger,
    sendRuntimeLog

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

// ⏸️ Pausar usuário
async function pause(req, res) {

    try {

        const {
            chatId
        } = req.params;

        // 🛡️ Validação
        if (

            !validateChatId(chatId)

        ) {

            logger.warn(
                "Tentativa de pausa com chatId inválido"
            );

            return res.status(400).send(
                "❌ Chat ID inválido"
            );

        }

        // ⏸️ Pausa usuário
        await pauseUser(chatId);

        logger.info(
            `Usuário pausado: ${chatId}`
        );

        // 📡 Runtime log
        await sendRuntimeLog(

            "⏸️ Usuário Pausado",

            `Usuário ${chatId} foi pausado pelo painel administrativo.`,

            "warn"

        );

        // 🚀 Redirect
        return res.redirect(
            "/dashboard"
        );

    } catch (error) {

        logger.error(
            `Erro ao pausar usuário: ${error.message}`
        );

        // 📡 Runtime log
        await sendRuntimeLog(

            "❌ Erro Admin",

            `Erro ao pausar usuário ${req.params.chatId}

${error.message}`,

            "error"

        );

        return res.status(500).send(
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

        // 🛡️ Validação
        if (

            !validateChatId(chatId)

        ) {

            logger.warn(
                "Tentativa de ativação com chatId inválido"
            );

            return res.status(400).send(
                "❌ Chat ID inválido"
            );

        }

        // ▶️ Ativa usuário
        await activateUser(chatId);

        logger.info(
            `Usuário ativado: ${chatId}`
        );

        // 📡 Runtime log
        await sendRuntimeLog(

            "▶️ Usuário Ativado",

            `Usuário ${chatId} foi ativado pelo painel administrativo.`,

            "success"

        );

        // 🚀 Redirect
        return res.redirect(
            "/dashboard"
        );

    } catch (error) {

        logger.error(
            `Erro ao ativar usuário: ${error.message}`
        );

        // 📡 Runtime log
        await sendRuntimeLog(

            "❌ Erro Admin",

            `Erro ao ativar usuário ${req.params.chatId}

${error.message}`,

            "error"

        );

        return res.status(500).send(
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

        // 🛡️ Validação
        if (

            !validateChatId(chatId)

        ) {

            logger.warn(
                "Tentativa de remoção com chatId inválido"
            );

            return res.status(400).send(
                "❌ Chat ID inválido"
            );

        }

        // 🗑️ Remove usuário
        await deleteUser(chatId);

        logger.info(
            `Usuário removido: ${chatId}`
        );

        // 📡 Runtime log
        await sendRuntimeLog(

            "🗑️ Usuário Removido",

            `Usuário ${chatId} foi removido pelo painel administrativo.`,

            "warn"

        );

        // 🚀 Redirect
        return res.redirect(
            "/dashboard"
        );

    } catch (error) {

        logger.error(
            `Erro ao remover usuário: ${error.message}`
        );

        // 📡 Runtime log
        await sendRuntimeLog(

            "❌ Erro Admin",

            `Erro ao remover usuário ${req.params.chatId}

${error.message}`,

            "error"

        );

        return res.status(500).send(
            "❌ Erro ao remover usuário"
        );

    }

}

module.exports = {

    pause,

    activate,

    remove,

};