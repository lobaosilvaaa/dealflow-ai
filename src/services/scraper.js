const axios = require("axios");
const cheerio = require("cheerio");

async function getShopeeProducts() {
    try {
        const url = "https://shopee.com.br/search?keyword=fone";

        const { data } = await axios.get(url);

        const $ = cheerio.load(data);

        const products = [];

        $(".shopee-search-item-result__item").each((i, el) => {
            const title = $(el).find("img").attr("alt");

            if (title) {
                products.push({
                    title,
                    price: "Preço variável",
                    link: "https://shopee.com.br",
                });
            }
        });

        return products.slice(0, 5);
    } catch (error) {
        console.error("Erro scraping:", error.message);
        return [];
    }
}

module.exports = {
    getShopeeProducts,
};