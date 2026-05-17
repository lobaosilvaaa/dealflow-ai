// 🚀 DealFlowAI Dashboard Routes

const express =
    require("express");

const router =
    express.Router();

const {
    dashboard,
} = require(
    "../controllers/dashboardController"
);

const {
    isAuthenticated,
} = require(
    "../middlewares/authMiddleware"
);

const {
    logger
} = require(
    "../services/logger"
);

// 📡 Middleware logs dashboard
router.use(

    "/dashboard",

    (req, res, next) => {

        logger.info(

            `Dashboard route acessada: ${req.method} ${req.originalUrl}`

        );

        next();

    }

);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Painel administrativo DealFlow AI
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Dashboard administrativo
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard carregado
 *       302:
 *         description: Redirect login
 */

// 📊 Dashboard principal
router.get(

    "/dashboard",

    isAuthenticated,

    dashboard

);

// ❌ Método inválido dashboard
router.all(

    "/dashboard",

    (req, res) => {

        logger.warn(

            `Método inválido dashboard: ${req.method}`

        );

        return res.status(405).send(

            "❌ Método não permitido"

        );

    }

);

module.exports = router;