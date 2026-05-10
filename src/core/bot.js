const { getRandomProduct } = require("../services/products");
const { generateCopy } = require("../services/copy");

const {
    setCategory,
    getCategory,
    setFrequency,
    getFrequency,
} = require("../database/settings");

async function processMessage(user, message) {

    // 🔒 Validação básica
    if (!message) {
        return "❌ Mensagem inválida.";
    }

    // 🧠 Normalização
    const text = message.trim().toLowerCase();

    // 🚀 START
    if (text === "/start") {

        return `
🚀 Bem-vindo ao DealFlow AI!

Automação inteligente de promoções via Telegram.

📊 Comandos disponíveis:

menu → abrir menu
promo → receber promoção

🎯 Categorias:
 /categoria gamer
 /categoria audio
 /categoria smartwatch

⏰ Frequência:
 /frequencia 5
    `;
    }

    // 📊 MENU
    if (text === "menu") {

        return `
📊 *MENU DEALFLOW AI*

1️⃣ Promoções
2️⃣ Ajuda

🎯 Categorias:
• gamer
• audio
• smartwatch

⏰ Frequência:
 /frequencia 5

Digite:
🔥 promo
ou
1
    `;
    }

    // 🎯 DEFINIR CATEGORIA
    if (text.startsWith("/categoria")) {

        const parts = text.split(" ");

        const category = parts[1];

        if (!category) {

            return `
❌ Informe uma categoria.

Exemplos:
 /categoria gamer
 /categoria audio
 /categoria smartwatch
      `;
        }

        // 💾 Salva categoria
        setCategory(user, category);

        return `
✅ Categoria definida com sucesso!

🎯 Nova categoria:
${category}

Agora suas promoções serão personalizadas.
    `;
    }

    // ⏰ DEFINIR FREQUÊNCIA
    if (text.startsWith("/frequencia")) {

        const parts = text.split(" ");

        const frequency = parseInt(parts[1]);

        if (!frequency || frequency <= 0) {

            return `
❌ Informe uma frequência válida.

Exemplo:
 /frequencia 5
      `;
        }

        // 💾 Salva frequência
        setFrequency(user, frequency);

        return `
✅ Frequência atualizada!

⏰ Nova frequência:
${frequency} minuto(s)

As promoções automáticas seguirão essa frequência.
    `;
    }

    // 🔥 PROMOÇÕES
    if (text === "1" || text === "promo") {

        try {

            // 🎯 Categoria do usuário
            const category = await getCategory(user);

            // 🛍️ Produto da categoria
            const product = await getRandomProduct(category);

            // ⚠️ Segurança
            if (!product) {

                return `
⚠️ Nenhuma promoção encontrada no momento.

Tente novamente mais tarde.
        `;
            }

            // ✍️ Copy automática
            return generateCopy(product);

        } catch (error) {

            console.error(
                "❌ Erro ao gerar promoção:",
                error.message
            );

            return `
❌ Erro ao buscar promoção.

Tente novamente em instantes.
      `;
        }
    }

    // ❓ AJUDA
    if (text === "2" || text === "ajuda") {

        const category = await getCategory(user);
        const frequency = await getFrequency(user);

        return `
❓ *AJUDA DEALFLOW AI*

📊 Comandos:

menu → abrir menu
promo → receber promoção

🎯 Categorias:
 /categoria gamer
 /categoria audio
 /categoria smartwatch

⏰ Frequência:
 /frequencia 5

📌 Configuração atual:

🎯 Categoria:
${category}

⏰ Frequência:
${frequency} minuto(s)

🚀 Mais recursos em breve!
    `;
    }

    // ❌ COMANDO INVÁLIDO
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