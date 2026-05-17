// 🚀 DealFlowAI Admin Routes

const express =
    require("express");

const router =
    express.Router();

const {

    activate,
    pause,
    remove,

} = require(
    "../controllers/adminController"
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

// 📡 Middleware logs admin
router.use(

    "/admin",

    (req, res, next) => {

        logger.info(

            `Admin route acessada: ${req.method} ${req.originalUrl}`

        );

        next();

    }

);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administração da plataforma DealFlow AI
 */

/**
 * @swagger
 * /admin/activate/{chatId}:
 *   post:
 *     summary: Ativa usuário
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Usuário ativado
 */

// ▶️ Ativar usuário
router.post(

    "/admin/activate/:chatId",

    isAuthenticated,

    activate

);

/**
 * @swagger
 * /admin/pause/{chatId}:
 *   post:
 *     summary: Pausa usuário
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Usuário pausado
 */

// ⏸️ Pausar usuário
router.post(

    "/admin/pause/:chatId",

    isAuthenticated,

    pause

);

/**
 * @swagger
 * /admin/delete/{chatId}:
 *   post:
 *     summary: Remove usuário
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Usuário removido
 */

// 🗑️ Remover usuário
router.post(

    "/admin/delete/:chatId",

    isAuthenticated,

    remove

);

// ❌ Método inválido
router.all(

    /^\/admin\/.*/,

    (req, res) => {

        logger.warn(

            `Método inválido admin route: ${req.method} ${req.originalUrl}`

        );

        return res.status(405).send(

            "❌ Método não permitido"

        );

    }

);

module.exports = router;