const express = require("express");

const router = express.Router();

const {

    loginPage,
    login,
    logout,

} = require("../controllers/authController");

router.get("/login", loginPage);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;