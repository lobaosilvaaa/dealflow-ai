function loginPage(req, res) {

    res.render("login");

}

function login(req, res) {

    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASSWORD
    ) {

        req.session.authenticated = true;

        console.log(
            "🔐 Login administrativo realizado"
        );

        return res.redirect("/dashboard");
    }

    return res.send("❌ Login inválido");

}

function logout(req, res) {

    req.session.destroy(() => {

        console.log("🚪 Logout realizado");

        res.redirect("/login");

    });

}

module.exports = {
    loginPage,
    login,
    logout,
};