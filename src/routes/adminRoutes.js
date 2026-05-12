const express = require("express");

const router = express.Router();

const {

    activate,
    pause,
    remove,

} = require("../controllers/adminController");

const {
    isAuthenticated,
} = require("../middlewares/authMiddleware");

router.post(
    "/admin/activate/:chatId",
    isAuthenticated,
    activate
);

router.post(
    "/admin/pause/:chatId",
    isAuthenticated,
    pause
);

router.post(
    "/admin/delete/:chatId",
    isAuthenticated,
    remove
);

module.exports = router;