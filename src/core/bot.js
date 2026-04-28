const { getRandomProduct } = require("../services/products");

async function processMessage(user, message) {
    const text = message.trim().toLowerCase();

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

    if (text === "promo") {
    const product = await getRandomProduct();

    return `
🔥 *OFERTA REAL!*

🛍️ ${product.title}
💰 ${product.price}

👉 ${product.link}
    `;
    }

    if (text === "2" || text === "ajuda") {
        return "❓ Em breve teremos suporte completo.";
    }

    return "❌ Não entendi. Digite 'menu'.";
}

module.exports = { processMessage };