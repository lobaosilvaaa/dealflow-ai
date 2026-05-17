// 🚀 DealFlowAI Auth Middleware

const {

    logger,
    sendRuntimeLog

} = require(
    "../services/logger"
);

// 🔐 Middleware autenticação
async function isAuthenticated(

    req,
    res,
    next

) {

    try {

        // 🛡️ Sessão válida
        if (

            req.session &&
            req.session.authenticated

        ) {

            // 📦 Injeta usuário
            req.user =
                req.session.user || {

                    role:
                        "admin"

                };

            return next();

        }

        // ⚠️ Acesso negado
        logger.warn(
            `Acesso não autenticado: ${req.originalUrl}`
        );

        // 📡 Runtime log
        await sendRuntimeLog(

            "⚠️ Unauthorized Access",

            `Tentativa de acesso sem autenticação.

🌐 Route: ${req.originalUrl}
📡 Method: ${req.method}
🌎 IP: ${req.ip}`,

            "warn"

        );

        // 🔄 Redirect login
        return res.redirect(
            "/login"
        );

    } catch (error) {

        logger.error(
            `Erro auth middleware: ${error.message}`
        );

        // 📡 Runtime error
        await sendRuntimeLog(

            "❌ Auth Middleware Error",

            error.stack ||
            error.message,

            "error"

        );

        return res.status(500).send(
            "❌ Erro interno autenticação"
        );

    }

}

module.exports = {

    isAuthenticated,

};