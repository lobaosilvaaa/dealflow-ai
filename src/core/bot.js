const { getRandomProduct } = require("../services/products");
const { generateCopy } = require("../services/copy");

async function processMessage(user, message) {
    // 🔒 Validação básica
    if (!message) {
        return "❌ Mensagem inválida.";
    }

    // 🧠 Normalização
    const text = message.trim().toLowerCase();

    // 🚀 Comando inicial
    if (text === "/start") {
        return `
🚀 Bem-vindo ao DealFlow AI!

Automação inteligente de promoções via Telegram.

Digite:
📊 menu → para ver opções
🔥 promo → para receber uma oferta
    `;
    }

    // 📊 Menu principal
    if (text === "menu") {
        return `
📊 *MENU DEALFLOW AI*

1️⃣ Promoções
2️⃣ Ajuda

Digite:
🔥 promo
ou
1
    `;
    }

    // 🔥 Promoções
    if (text === "1" || text === "promo") {
        try {
            // 🛍️ Busca produto
            const product = await getRandomProduct();

            // ⚠️ Fallback de segurança
            if (!product) {
                return `
⚠️ Nenhuma promoção disponível no momento.

Tente novamente em instantes.
        `;
            }

            // ✍️ Gera copy automática
            return generateCopy(product);

        } catch (error) {
            console.error("❌ Erro ao gerar promoção:", error.message);

            return `
❌ Erro ao buscar promoção.

Tente novamente mais tarde.
        `;
        }
    }

    // ❓ Ajuda
    if (text === "2" || text === "ajuda") {
        return `
❓ *AJUDA DEALFLOW AI*

Comandos disponíveis:

📊 menu → abre o menu
🔥 promo → recebe oferta automática

Mais recursos em breve 🚀
    `;
    }

    // ❌ Comando inválido
    return `
❌ Comando não reconhecido.

Digite:
📊 menu
para ver as opções disponíveis.
    `;
}

module.exports = {
    processMessage,
};