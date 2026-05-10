const { getRandomProduct } = require("../services/products");
const { generateCopy } = require("../services/copy");

const {
    setCategory,
    getCategory,
    setFrequency,
    getFrequency,
    setActive,
    isActive,
} = require("../database/settings");

const {
    getStats,
} = require("../database/stats");

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

🎛️ Controle:
 /pausar
 /ativar

📊 Estatísticas:
 /stats
    `;
    }

    // 📊 MENU
    if (text === "menu") {

        const category = await getCategory(user);
        const frequency = await getFrequency(user);
        const active = await isActive(user);

        return `
📊 *MENU DEALFLOW AI*

1️⃣ Promoções
2️⃣ Ajuda

━━━━━━━━━━━━━━━

🎯 Categoria atual:
${category}

⏰ Frequência:
${frequency} minuto(s)

🎛️ Status:
${active ? "🟢 Ativado" : "🔴 Pausado"}

━━━━━━━━━━━━━━━

📌 Comandos:

🔥 promo
🎯 /categoria gamer
⏰ /frequencia 5
⏸️ /pausar
▶️ /ativar
📊 /stats
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

        setFrequency(user, frequency);

        return `
✅ Frequência atualizada!

⏰ Nova frequência:
${frequency} minuto(s)

As promoções automáticas seguirão essa frequência.
    `;
    }

    // ⏸️ PAUSAR
    if (text === "/pausar") {

        setActive(user, 0);

        return `
⏸️ Promoções pausadas com sucesso.

Você não receberá promoções automáticas até ativar novamente.
    `;
    }

    // ▶️ ATIVAR
    if (text === "/ativar") {

        setActive(user, 1);

        return `
▶️ Promoções ativadas novamente.

As promoções automáticas voltarão a ser enviadas.
    `;
    }

    // 📊 STATS
    if (text === "/stats") {

        const stats = await getStats();

        const category = await getCategory(user);
        const frequency = await getFrequency(user);
        const active = await isActive(user);

        return `
📊 *DEALFLOW AI STATS*

📤 Promoções enviadas:
${stats.sent_promos}

━━━━━━━━━━━━━━━

📌 Suas configurações:

🎯 Categoria:
${category}

⏰ Frequência:
${frequency} minuto(s)

🎛️ Status:
${active ? "🟢 Ativado" : "🔴 Pausado"}
    `;
    }

    // 🔥 PROMOÇÕES
    if (text === "1" || text === "promo") {

        try {

            const category = await getCategory(user);

            const product = await getRandomProduct(category);

            if (!product) {

                return `
⚠️ Nenhuma promoção encontrada no momento.

Tente novamente mais tarde.
        `;
            }

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
        const active = await isActive(user);

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

🎛️ Controle:
 /pausar
 /ativar

📊 Estatísticas:
 /stats

━━━━━━━━━━━━━━━

📌 Configuração atual:

🎯 Categoria:
${category}

⏰ Frequência:
${frequency} minuto(s)

🎛️ Status:
${active ? "🟢 Ativado" : "🔴 Pausado"}

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