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
    isAuthenticated,
} = require(
    "../middlewares/authMiddleware"
);

// 📊 Estatísticas
router.get(
    "/api/stats",
    isAuthenticated,
    stats
);

// 👥 Usuários
router.get(
    "/api/users",
    isAuthenticated,
    users
);

// 📜 Logs
router.get(
    "/api/logs",
    isAuthenticated,
    logs
);

module.exports = router;