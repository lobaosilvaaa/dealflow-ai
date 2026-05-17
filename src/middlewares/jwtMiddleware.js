// 🚀 DealFlowAI JWT Middleware

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

// 🔐 Verifica JWT
async function verifyToken(

    req,
    res,
    next

) {

    try {

        const authHeader =
            req.headers.authorization;

        // ⛔ Header ausente
        if (!authHeader) {

            logger.warn(
                "JWT ausente"
            );

            // 📡 Runtime
            await sendRuntimeLog(

                "⚠️ JWT Missing",

                `Requisição sem token JWT.

🌐 Route: ${req.originalUrl}
📡 Method: ${req.method}
🌎 Environment: ${ENVIRONMENT}
🖥️ IP: ${req.ip}`,

                "warn"

            );

            return res.status(401).json({

                success: false,

                timestamp:
                    new Date(),

                environment:
                    ENVIRONMENT,

                error:
                    "Token não fornecido"

            });

        }

        // ⛔ Formato inválido
        if (

            !authHeader.startsWith(
                "Bearer "
            )

        ) {

            logger.warn(
                "Bearer inválido"
            );

            // 📡 Runtime
            await sendRuntimeLog(

                "⚠️ Invalid Bearer",

                `Bearer token inválido.

🌐 Route: ${req.originalUrl}
📡 Method: ${req.method}
🖥️ IP: ${req.ip}`,

                "warn"

            );

            return res.status(401).json({

                success: false,

                timestamp:
                    new Date(),

                environment:
                    ENVIRONMENT,

                error:
                    "Formato Bearer inválido"

            });

        }

        // 🔑 Extrai token
        const token =
            authHeader.split(" ")[1];

        // ⛔ Token vazio
        if (!token) {

            logger.warn(
                "JWT vazio"
            );

            return res.status(401).json({

                success: false,

                timestamp:
                    new Date(),

                error:
                    "Token vazio"

            });

        }

        // 🔐 Verifica JWT
        const decoded =
            jwt.verify(

                token,

                process.env.JWT_SECRET

            );

        // 👤 Injeta usuário
        req.user = {

            ...decoded,

            role:
                decoded.role || "admin"

        };

        logger.info(
            `JWT validado: ${decoded.username || "unknown"}`
        );

        // 🚀 Continua
        return next();

    } catch (error) {

        logger.warn(
            `JWT inválido: ${error.message}`
        );

        // 📡 Runtime
        await sendRuntimeLog(

            "❌ JWT Invalid",

            `Falha validação JWT.

🌐 Route: ${req.originalUrl}
📡 Method: ${req.method}
🖥️ IP: ${req.ip}

${error.message}`,

            "error"

        );

        return res.status(401).json({

            success: false,

            timestamp:
                new Date(),

            environment:
                ENVIRONMENT,

            error:
                "Token inválido"

        });

    }

}

module.exports = {

    verifyToken,

};