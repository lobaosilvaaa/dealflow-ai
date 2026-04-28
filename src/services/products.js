const { getShopeeProducts } = require("./scraper");

async function getRandomProduct() {
    const products = await getShopeeProducts();

    if (!products || products.length === 0) {
        return {
            title: "Produto indisponível",
            price: "-",
            link: "#",
        };
    }

    const index = Math.floor(Math.random() * products.length);
    return products[index];
}

module.exports = {
    getRandomProduct,
};