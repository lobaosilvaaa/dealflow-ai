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

// 📊 Estatísticas
router.get(

    "/api/stats",

    verifyToken,

    stats

);

// 👥 Usuários
router.get(

    "/api/users",

    verifyToken,

    users

);

// 📜 Logs
router.get(

    "/api/logs",

    verifyToken,

    logs

);

module.exports = router;