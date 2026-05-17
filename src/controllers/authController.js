// 🚀 DealFlowAI Auth Controller

const jwt =
    require("jsonwebtoken");

const {

    logger,
    sendRuntimeLog

} = require(
    "../services/logger"
);

// 🌎 Ambiente
const ENVIRONMENT =
    process.env.NODE_ENV ||
    "development";

// 📄 Página login
function loginPage(req, res) {

    try {

        return res.render(

            "login",

            {

                error: null

            }

        );

    } catch (error) {

        logger.error(
            `Erro render login: ${error.message}`
        );

        return res.status(500).send(
            "❌ Erro interno"
        );

    }

}

// 🔐 Login dashboard
async function login(req, res) {

    try {

        const {

            username,
            password

        } = req.body;

        // 🛡️ Validação
        if (

            !username ||
            !password

        ) {

            logger.warn(
                "Tentativa login sem credenciais"
            );

            return res.render(

                "login",

                {

                    error:
                        "❌ Preencha usuário e senha"

                }

            );

        }

        // ❌ Login inválido
        if (

            username !==
            process.env.ADMIN_USER ||

            password !==
            process.env.ADMIN_PASSWORD

        ) {

            logger.warn(

                `Tentativa login inválida: ${username}`

            );

            // 📡 Runtime
            await sendRuntimeLog(

                "⚠️ Login Inválido",

                `Tentativa de login inválida.

👤 User: ${username}
🌎 Environment: ${ENVIRONMENT}`,

                "warn"

            );

            return res.render(

                "login",

                {

                    error:
                        "❌ Usuário ou senha inválidos"

                }

            );

        }

        // 🔐 Sessão
        req.session.authenticated =
            true;

        req.session.user = {

            username,

            role:
                "admin"

        };

        // 📜 Logs
        logger.info(
            `Login administrativo realizado: ${username}`
        );

        // 📡 Runtime
        await sendRuntimeLog(

            "🔐 Login Administrativo",

            `Novo login administrativo realizado.

👤 User: ${username}
🌎 Environment: ${ENVIRONMENT}`,

            "success"

        );

        // 🚀 Redirect
        return res.redirect(
            "/dashboard"
        );

    } catch (error) {

        logger.error(
            `Erro login dashboard: ${error.message}`
        );

        // 📡 Runtime
        await sendRuntimeLog(

            "❌ Login Error",

            error.stack ||
            error.message,

            "error"

        );

        return res.status(500).render(

            "login",

            {

                error:
                    "❌ Erro interno"

            }

        );

    }

}

// 🚪 Logout
async function logout(req, res) {

    try {

        const username =
            req.session?.user?.username ||
            "unknown";

        logger.info(
            `Logout realizado: ${username}`
        );

        // 📡 Runtime
        await sendRuntimeLog(

            "🚪 Logout",

            `Sessão encerrada.

👤 User: ${username}`,

            "info"

        );

        // 🛑 Destroy sessão
        req.session.destroy(error => {

            if (error) {

                logger.error(
                    `Erro logout: ${error.message}`
                );

                return res.status(500).send(
                    "❌ Erro logout"
                );

            }

            return res.redirect(
                "/login"
            );

        });

    } catch (error) {

        logger.error(
            `Erro logout: ${error.message}`
        );

        return res.status(500).send(
            "❌ Erro interno"
        );

    }

}

// 🔑 Login API JWT
async function apiLogin(req, res) {

    try {

        const {

            username,
            password

        } = req.body;

        // 🛡️ Validação
        if (

            !username ||
            !password

        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Usuário e senha obrigatórios"

            });

        }

        // ❌ JWT inválido
        if (

            username !==
            process.env.ADMIN_USER ||

            password !==
            process.env.ADMIN_PASSWORD

        ) {

            logger.warn(

                `Tentativa JWT inválida: ${username}`

            );

            // 📡 Runtime
            await sendRuntimeLog(

                "⚠️ JWT Inválido",

                `Tentativa JWT inválida.

👤 User: ${username}`,

                "warn"

            );

            return res.status(401).json({

                success: false,

                error:
                    "Credenciais inválidas"

            });

        }

        // 🔐 Gera token
        const token =
            jwt.sign(

                {

                    username,

                    role:
                        "admin"

                },

                process.env.JWT_SECRET,

                {

                    expiresIn:
                        "24h"

                }

            );

        logger.info(
            `Token JWT gerado: ${username}`
        );

        // 📡 Runtime
        await sendRuntimeLog(

            "🔑 JWT Gerado",

            `Novo token JWT gerado.

👤 User: ${username}
⏱️ Expiração: 24h`,

            "success"

        );

        // 🚀 Resposta
        return res.json({

            success: true,

            token,

            expiresIn:
                "24h",

            environment:
                ENVIRONMENT,

        });

    } catch (error) {

        logger.error(
            `Erro JWT login: ${error.message}`
        );

        // 📡 Runtime
        await sendRuntimeLog(

            "❌ JWT Error",

            error.stack ||
            error.message,

            "error"

        );

        return res.status(500).json({

            success: false,

            error:
                "Erro interno"

        });

    }

}

module.exports = {

    loginPage,

    login,

    logout,

    apiLogin,

};