async function processMessage(user, message) {
    const text = message.toLowerCase();

    if (text === "/start") {
        return "🚀 Bem-vindo ao DealFlow AI!\nDigite 'menu' para ver opções.";
    }

    if (text === "menu") {
        return `
            📊 Menu:
            1️⃣ Promoções
            2️⃣ Ajuda
        `;
    }

    if (text === "1" || text === "promo") {
        return "🔥 Promoção teste:\nProduto X por R$99\nLink: https://exemplo.com";
    }

    if (text === "2" || text === "ajuda") {
        return "❓ Em breve teremos suporte completo.";
    }

    return "❌ Não entendi. Digite 'menu'.";
}

module.exports = { processMessage };
