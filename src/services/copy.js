// 🚀 DealFlowAI Copy Generator

const {
    logger
} = require(
    "./logger"
);

// 🎯 Headlines dinâmicas
const HEADLINES = [

    "🔥 OFERTA IMPERDÍVEL!",
    "🚨 PROMOÇÃO RELÂMPAGO!",
    "💥 DESCONTO HOJE!",
    "⚡ ÚLTIMAS UNIDADES!",
    "🛒 APROVEITE AGORA!",
    "🎯 SUPER OFERTA!",
    "🚀 PREÇO BAIXOU!",
    "💎 OFERTA PREMIUM!",

];

// ✨ Benefícios dinâmicos
const BENEFITS = [

    "Qualidade premium",
    "Alta durabilidade",
    "Mais vendido do momento",
    "Avaliações positivas",
    "Excelente custo-benefício",
    "Tecnologia avançada",
    "Produto recomendado",
    "Entrega rápida",

];

// 📢 Call-To-Action
const CTAS = [

    "👉 Compre agora:",
    "🛒 Garanta já:",
    "⚡ Aproveite a oferta:",
    "🔥 Clique e confira:",
    "🚀 Não perca:",

];

// 🎲 Random helper
function randomItem(array) {

    return array[

        Math.floor(
            Math.random() * array.length
        )

    ];

}

// 🛡️ Sanitiza texto
function sanitize(value) {

    if (!value) {

        return "Indisponível";

    }

    return String(value).trim();

}

// 🚀 Gera copy dinâmica
function generateCopy(product) {

    try {

        // 🛡️ Produto obrigatório
        if (!product) {

            logger.warn(
                "generateCopy sem produto"
            );

            return `

❌ Produto indisponível no momento.

`;

        }

        // 🎲 Conteúdo dinâmico
        const headline =
            randomItem(HEADLINES);

        const benefit =
            randomItem(BENEFITS);

        const cta =
            randomItem(CTAS);

        // 📦 Dados produto
        const title =
            sanitize(

                product.title ||
                product.name

            );

        const description =
            sanitize(
                product.description
            );

        const price =
            sanitize(
                product.price
            );

        const link =
            sanitize(
                product.link
            );

        // 🚀 Copy final
        const message = `

${headline}

🛍️ ${title}

✨ ${benefit}

📦 ${description}

💰 ${price}

⚠️ Estoque limitado!

${cta}
${link}

━━━━━━━━━━━━━━━━━━

🤖 DealFlow AI

`;

        logger.info(
            `Copy gerada: ${title}`
        );

        return message;

    } catch (error) {

        logger.error(
            `Erro generateCopy: ${error.message}`
        );

        return `

❌ Erro ao gerar promoção.

`;

    }

}

module.exports = {

    generateCopy,

};