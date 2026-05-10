function generateCopy(product) {
    const headlines = [
        "🔥 OFERTA IMPERDÍVEL!",
        "🚨 PROMOÇÃO RELÂMPAGO!",
        "💥 DESCONTO HOJE!",
    ];

    const benefits = [
        "Qualidade premium",
        "Alta durabilidade",
        "Mais vendido do momento",
        "Avaliações positivas",
    ];

    const randomHeadline =
        headlines[Math.floor(Math.random() * headlines.length)];

    const randomBenefit =
        benefits[Math.floor(Math.random() * benefits.length)];

    return `
${randomHeadline}

🛍️ ${product.title}
✨ ${randomBenefit}

💰 ${product.price || "Preço imperdível"}
⚠️ Estoque limitado!

👉 Compre agora:
${product.link}
    `;
}

module.exports = {
    generateCopy,
};