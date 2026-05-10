const products = {
    gamer: [
        {
            title: "Mouse Gamer RGB",
            price: "R$89,90",
            link: "https://shopee.com.br/",
        },
    ],

    audio: [
        {
            title: "Fone Bluetooth TWS",
            price: "R$49,90",
            link: "https://shopee.com.br/",
        },
    ],

    smartwatch: [
        {
            title: "Smartwatch Ultra",
            price: "R$129,90",
            link: "https://shopee.com.br/",
        },
    ],

    geral: [
        {
            title: "Oferta Especial",
            price: "R$99,90",
            link: "https://shopee.com.br/",
        },
    ],
};

async function getRandomProduct(category = "geral") {

    const selected =
        products[category] || products["geral"];

    const index = Math.floor(Math.random() * selected.length);

    return selected[index];
}

module.exports = {
    getRandomProduct,
};