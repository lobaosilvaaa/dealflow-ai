const logger =
    require("../services/logger");

function loginPage(req, res) {

    res.render("login");

}

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

function logout(req, res) {

    logger.info(
        "Logout realizado"
    );

    req.session.destroy(() => {

        res.redirect("/login");

    });

}

module.exports = {

    loginPage,

    login,

    logout,

};