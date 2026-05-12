const express = require("express");

const router = express.Router();

const {

    loginPage,
    login,
    logout,
    apiLogin,

} = require(
    "../controllers/authController"
);

// 🌐 Login dashboard
router.get(
    "/login",
    loginPage
);

// 🔐 Login dashboard
router.post(
    "/login",
    login
);

// 🚪 Logout
router.get(
    "/logout",
    logout
);

// 🔑 Login API JWT
router.post(
    "/api/login",
    apiLogin
);

module.exports = router;