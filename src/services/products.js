function getMockProducts() {
    return [
        {
            title: "Fone Bluetooth TWS",
            price: "R$49,90",
            link: "https://exemplo.com/fone",
        },
        {
            title: "Smartwatch Ultra",
            price: "R$129,90",
            link: "https://exemplo.com/relogio",
        },
        {
            title: "Caixa de Som JBL",
            price: "R$199,90",
            link: "https://exemplo.com/caixa",
        },
    ];
}

function getRandomProduct() {
    const products = getMockProducts();
    const index = Math.floor(Math.random() * products.length);
    return products[index];
}

module.exports = {
    getRandomProduct,
};