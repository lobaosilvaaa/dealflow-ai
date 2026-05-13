const express = require("express");

const router = express.Router();

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

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Retorna estatísticas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas da plataforma
 */

// 📊 Estatísticas
router.get(

    "/api/stats",

    verifyToken,

    stats

);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retorna usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 */

// 👥 Usuários
router.get(

    "/api/users",

    verifyToken,

    users

);

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Retorna logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs recentes
 */

// 📜 Logs
router.get(

    "/api/logs",

    verifyToken,

    logs

);

module.exports = router;