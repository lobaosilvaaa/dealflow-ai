const chats = new Set();

function addChat(chatId) {
    chats.add(chatId);
}

function getChats() {
    return Array.from(chats);
}

module.exports = { addChat, getChats };