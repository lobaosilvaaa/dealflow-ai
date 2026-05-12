const jwt =
    require("jsonwebtoken");

const logger =
    require("../services/logger");

// 📄 Página login
function loginPage(req, res) {

    res.render("login");

}

// 🔐 Login dashboard
function login(req, res) {

    const {
        username,
        password
    } = req.body;

    if (

        username ===
        process.env.ADMIN_USER

        &&

        password ===
        process.env.ADMIN_PASSWORD

    ) {

        req.session.authenticated = true;

        logger.info(
            "Login administrativo realizado"
        );

        return res.redirect(
            "/dashboard"
        );

    }

    logger.warn(
        `Tentativa de login inválida: ${username}`
    );

    return res.send(
        "❌ Login inválido"
    );

}

// 🚪 Logout
function logout(req, res) {

    logger.info(
        "Logout realizado"
    );

    req.session.destroy(() => {

        res.redirect("/login");

    });

}

// 🔑 Login API JWT
function apiLogin(req, res) {

    const {
        username,
        password
    } = req.body;

    if (

        username ===
        process.env.ADMIN_USER

        &&

        password ===
        process.env.ADMIN_PASSWORD

    ) {

        const token =
            jwt.sign(

                {
                    username
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "24h"
                }

            );

        logger.info(
            "Token JWT gerado"
        );

        return res.json({

            success: true,

            token,

        });

    }

    logger.warn(
        `Tentativa JWT inválida: ${username}`
    );

    return res.status(401).json({

        success: false,

        error:
            "Credenciais inválidas"

    });

}

module.exports = {

    loginPage,

    login,

    logout,

    apiLogin,

};