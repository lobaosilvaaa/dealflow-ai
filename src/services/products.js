// 🚀 DealFlowAI Products Service

const {
    logger
} = require(
    "./logger"
);

// 📦 Produtos catálogo
const products = {

    // 🌎 Geral
    geral: [

        {

            id: 1,

            title:
                "Mouse Gamer RGB",

            description:
                "Alta durabilidade e iluminação RGB premium",

            category:
                "geral",

            price:
                "R$89,90",

            store:
                "Shopee",

            link:
                "https://shopee.com.br",

            tags: [

                "mouse",
                "rgb",
                "gamer"

            ]

        },

        {

            id: 2,

            title:
                "Teclado Mecânico",

            description:
                "Switch azul premium com resposta ultrarrápida",

            category:
                "geral",

            price:
                "R$199,90",

            store:
                "Amazon",

            link:
                "https://amazon.com.br",

            tags: [

                "teclado",
                "mecanico",
                "switch"

            ]

        }

    ],

    // 🎮 Gamer
    gamer: [

        {

            id: 3,

            title:
                "Headset Gamer Pro",

            description:
                "Som surround 7.1 com cancelamento de ruído",

            category:
                "gamer",

            price:
                "R$249,90",

            store:
                "Kabum",

            link:
                "https://kabum.com.br",

            tags: [

                "headset",
                "audio",
                "gamer"

            ]

        },

        {

            id: 4,

            title:
                "Mousepad RGB",

            description:
                "Iluminação premium e superfície speed control",

            category:
                "gamer",

            price:
                "R$59,90",

            store:
                "Pichau",

            link:
                "https://pichau.com.br",

            tags: [

                "mousepad",
                "rgb",
                "setup"

            ]

        }

    ],

    // 📱 Tecnologia
    tech: [

        {

            id: 5,

            title:
                "Smartwatch Ultra",

            description:
                "Monitoramento fitness e bateria longa duração",

            category:
                "tech",

            price:
                "R$329,90",

            store:
                "Amazon",

            link:
                "https://amazon.com.br",

            tags: [

                "smartwatch",
                "fitness",
                "wearable"

            ]

        }

    ]

};

// 🎲 Random helper
function randomItem(array) {

    return array[

        Math.floor(
            Math.random() * array.length
        )

    ];

}

// 🎯 Produto aleatório
function getRandomProduct(

    category = "geral"

) {

    try {

        const categoryProducts =
            products[category];

        // 🛡️ Categoria inexistente
        if (

            !categoryProducts ||
            categoryProducts.length === 0

        ) {

            logger.warn(
                `Categoria inexistente: ${category}`
            );

            return randomItem(
                products.geral
            );

        }

        // 🎲 Produto aleatório
        const product =
            randomItem(
                categoryProducts
            );

        logger.info(
            `Produto selecionado: ${product.title}`
        );

        return product;

    } catch (error) {

        logger.error(
            `Erro getRandomProduct: ${error.message}`
        );

        return null;

    }

}

// 📦 Todos produtos
function getAllProducts() {

    try {

        return products;

    } catch (error) {

        logger.error(
            `Erro getAllProducts: ${error.message}`
        );

        return {};

    }

}

// 📂 Categorias disponíveis
function getCategories() {

    try {

        return Object.keys(products);

    } catch (error) {

        logger.error(
            `Erro getCategories: ${error.message}`
        );

        return [];

    }

}

// 🔍 Busca produto por categoria
function getProductsByCategory(category) {

    try {

        return products[category] || [];

    } catch (error) {

        logger.error(
            `Erro getProductsByCategory: ${error.message}`
        );

        return [];

    }

}

module.exports = {

    getRandomProduct,

    getAllProducts,

    getCategories,

    getProductsByCategory,

};