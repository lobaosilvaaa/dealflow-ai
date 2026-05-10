const products = [
    {
        title: "Fone Bluetooth TWS",
        price: "R$49,90",
        link: "https://shopee.com.br/",
    },
    {
        title: "Smartwatch Ultra",
        price: "R$129,90",
        link: "https://shopee.com.br/",
    },
    {
        title: "Caixa de Som JBL",
        price: "R$199,90",
        link: "https://shopee.com.br/",
    },
    {
        title: "Teclado Mecânico Gamer",
        price: "R$159,90",
        link: "https://shopee.com.br/",
    },
    {
        title: "Mouse Gamer RGB",
        price: "R$89,90",
        link: "https://shopee.com.br/",
    },
];

async function getRandomProduct() {
    const index = Math.floor(Math.random() * products.length);

    return products[index];
}

module.exports = {
    getRandomProduct,
};