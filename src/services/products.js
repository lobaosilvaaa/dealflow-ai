const products = {

    geral: [

        {

            name:
                "Mouse Gamer RGB",

            description:
                "Alta durabilidade",

            price:
                "R$89,90",

            link:
                "https://shopee.com.br"

        },

        {

            name:
                "Teclado Mecânico",

            description:
                "Switch azul premium",

            price:
                "R$199,90",

            link:
                "https://amazon.com.br"

        }

    ],

    gamer: [

        {

            name:
                "Headset Gamer Pro",

            description:
                "Som surround 7.1",

            price:
                "R$249,90",

            link:
                "https://kabum.com.br"

        },

        {

            name:
                "Mousepad RGB",

            description:
                "Iluminação premium",

            price:
                "R$59,90",

            link:
                "https://pichau.com.br"

        }

    ]

};

// 🎯 Produto aleatório
function getRandomProduct(category = "geral") {

    const categoryProducts =
        products[category];

    if (

        !categoryProducts ||
        categoryProducts.length === 0

    ) {

        return products.geral[0];

    }

    const randomIndex =
        Math.floor(

            Math.random() *
            categoryProducts.length

        );

    return categoryProducts[
        randomIndex
    ];

}

module.exports = {

    getRandomProduct,

};