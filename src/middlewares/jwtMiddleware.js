const jwt =
    require("jsonwebtoken");

const {
    logger
} = require(
    "../services/logger"
);

// 🔐 Verifica JWT
function verifyToken(

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

            return res.status(401).json({

                success: false,

                timestamp:
                    new Date(),

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

            return res.status(401).json({

                success: false,

                timestamp:
                    new Date(),

                error:
                    "Formato Bearer inválido"

            });

        }

        // 🔑 Extrai token
        const token =
            authHeader.split(" ")[1];

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

        next();

    } catch (error) {

        logger.warn(
            `JWT inválido: ${error.message}`
        );

        return res.status(401).json({

            success: false,

            timestamp:
                new Date(),

            error:
                "Token inválido"

        });

    }

}

module.exports = {

    verifyToken,

};