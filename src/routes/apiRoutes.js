// 🚀 DealFlowAI API Routes

const express =
    require("express");

const router =
    express.Router();

const {

    stats,
    users,
    logs,
    health,

} = require(
    "../controllers/apiController"
);

const {

    verifyToken,

} = require(
    "../middlewares/jwtMiddleware"
);

const {
    logger
} = require(
    "../services/logger"
);

/**
 * @swagger
 * tags:
 *   name: DealFlow API
 *   description: API oficial DealFlow AI
 */

// ❤️ Healthcheck público
router.get(

    "/health",

    health

);

// 📡 Middleware logs API
router.use(

    "/api",

    (req, res, next) => {

        logger.info(

            `API acessada: ${req.method} ${req.originalUrl}`

        );

        next();

    }

);

// 🔐 Middleware JWT apenas API privada
router.use(

    "/api/v1",

    verifyToken

);

/**
 * @swagger
 * /api/v1/stats:
 *   get:
 *     summary: Retorna estatísticas da plataforma
 *     tags: [DealFlow API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas carregadas com sucesso
 *       401:
 *         description: Token inválido
 */

// 📊 Estatísticas
router.get(

    "/api/v1/stats",

    stats

);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retorna usuários registrados
 *     tags: [DealFlow API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Token inválido
 */

// 👥 Usuários
router.get(

    "/api/v1/users",

    users

);

/**
 * @swagger
 * /api/v1/logs:
 *   get:
 *     summary: Retorna logs recentes
 *     tags: [DealFlow API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs carregados
 *       401:
 *         description: Token inválido
 */

// 📜 Logs
router.get(

    "/api/v1/logs",

    logs

);

// ❌ API inexistente
router.use(

    "/api",

    (req, res) => {

        logger.warn(

            `API endpoint inexistente: ${req.originalUrl}`

        );

        return res.status(404).json({

            success: false,

            error:
                "Endpoint não encontrado"

        });

    }

);

module.exports = router;