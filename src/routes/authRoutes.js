// 🚀 DealFlowAI Auth Routes

const express =
    require("express");

const router =
    express.Router();

const {

    loginPage,
    login,
    logout,
    apiLogin,

} = require(
    "../controllers/authController"
);

const {
    logger
} = require(
    "../services/logger"
);

// 📡 Middleware logs auth
router.use(

    (req, res, next) => {

        logger.info(

            `Auth route acessada: ${req.method} ${req.originalUrl}`

        );

        next();

    }

);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints de autenticação
 */

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Página de login administrativo
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Página carregada
 */

// 🌐 Página login
router.get(

    "/login",

    loginPage

);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login administrativo
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect dashboard
 *       401:
 *         description: Credenciais inválidas
 */

// 🔐 Login dashboard
router.post(

    "/login",

    login

);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Realiza logout administrativo
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect login
 */

// 🚪 Logout
router.get(

    "/logout",

    logout

);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Gera token JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT gerado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */

// 🔑 Login API JWT
router.post(

    "/api/login",

    apiLogin

);

module.exports = router;