// 🚀 DealFlowAI Scraper Service

const axios =
    require("axios");

const cheerio =
    require("cheerio");

const {

    logger,
    sendRuntimeLog

} = require(
    "./logger"
);

// 🌐 User-Agent rotativo
const USER_AGENT =

    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// ⏱️ Timeout requests
const REQUEST_TIMEOUT =
    10000;

// 📦 Sanitiza texto
function sanitize(text) {

    if (!text) {

        return null;

    }

    return String(text)
        .replace(/\s+/g, " ")
        .trim();

}

// 🔗 Normaliza URL
function normalizeUrl(url) {

    if (!url) {

        return null;

    }

    // 🔗 URL relativa
    if (

        url.startsWith("/")

    ) {

        return `https://shopee.com.br${url}`;

    }

    return url;

}

// 🛒 Scraper Shopee
async function getShopeeProducts(

    keyword = "fone"

) {

    try {

        logger.info(
            `Scraping Shopee iniciado: ${keyword}`
        );

        // 🔍 URL busca
        const url =

            `https://shopee.com.br/search?keyword=${encodeURIComponent(keyword)}`;

        // 🌐 Request
        const response =
            await axios.get(

                url,

                {

                    timeout:
                        REQUEST_TIMEOUT,

                    headers: {

                        "User-Agent":
                            USER_AGENT,

                        Accept:
                            "text/html,application/xhtml+xml",

                        "Accept-Language":
                            "pt-BR,pt;q=0.9",

                    }

                }

            );

        // 📦 HTML
        const html =
            response.data;

        // 📄 Carrega DOM
        const $ =
            cheerio.load(html);

        const products =
            [];

        // 🛒 Produtos Shopee
        $(".shopee-search-item-result__item").each(

            (index, element) => {

                try {

                    const title =
                        sanitize(

                            $(element)
                                .find("img")
                                .attr("alt")

                        );

                    const link =
                        normalizeUrl(

                            $(element)
                                .find("a")
                                .attr("href")

                        );

                    // 🛡️ Produto inválido
                    if (

                        !title ||
                        !link

                    ) {

                        return;

                    }

                    products.push({

                        title,

                        description:
                            "Produto encontrado via scraping automático",

                        category:
                            "scraper",

                        store:
                            "Shopee",

                        price:
                            "Preço variável",

                        link,

                    });

                } catch (productError) {

                    logger.warn(

                        `Erro parsing produto: ${productError.message}`

                    );

                }

            }

        );

        // 📦 Limita resultados
        const finalProducts =
            products.slice(0, 10);

        logger.info(

            `${finalProducts.length} produtos encontrados`

        );

        return finalProducts;

    } catch (error) {

        logger.error(
            `Erro scraping Shopee: ${error.message}`
        );

        // 📡 Runtime log
        await sendRuntimeLog(

            "❌ Scraper Error",

            error.stack ||
            error.message,

            "scraper",

            "error",

            "🕷️ Scraper"

        );

        return [];

    }

}

// 🛒 Busca múltiplas keywords
async function getMultipleProducts(

    keywords = []

) {

    try {

        const allProducts =
            [];

        for (const keyword of keywords) {

            const products =
                await getShopeeProducts(
                    keyword
                );

            allProducts.push(
                ...products
            );

        }

        return allProducts;

    } catch (error) {

        logger.error(

            `Erro getMultipleProducts: ${error.message}`

        );

        return [];

    }

}

// 📊 Status scraper
function getScraperStatus() {

    return {

        status:
            "online",

        timeout:
            REQUEST_TIMEOUT,

        userAgent:
            USER_AGENT,

    };

}

module.exports = {

    getShopeeProducts,

    getMultipleProducts,

    getScraperStatus,

};