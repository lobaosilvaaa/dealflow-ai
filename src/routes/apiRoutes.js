const express =
    require("express");

const router =
    express.Router();

const {

    stats,
    users,
    logs,

} = require(
    "../controllers/apiController"
);

const {

    verifyToken,

} = require(
    "../middlewares/jwtMiddleware"
);

// 🔐 Middleware global JWT
router.use(
    verifyToken
);

/**
 * @swagger
 * tags:
 *   name: DealFlow API
 *   description: API oficial DealFlow AI
 */

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
 */

// 📜 Logs
router.get(

    "/api/v1/logs",

    logs

);

module.exports = router;