const {

    updateUserStatus,
    deleteUser,

} = require("../database/settings");

function activate(req, res) {

    updateUserStatus(
        req.params.chatId,
        1
    );

    res.redirect("/dashboard");

}

function pause(req, res) {

    updateUserStatus(
        req.params.chatId,
        0
    );

    res.redirect("/dashboard");

}

function remove(req, res) {

    deleteUser(
        req.params.chatId
    );

    res.redirect("/dashboard");

}

module.exports = {
    activate,
    pause,
    remove,
};