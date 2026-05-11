// 📊 Captura dados do HTML
const sentPromos = Number(
    document.body.dataset.promos
);

const totalUsers = Number(
    document.body.dataset.users
);

// 📈 Canvas
const ctx = document.getElementById(
    "promoChart"
);

// 🚀 Chart.js
new Chart(ctx, {

    type: "doughnut",

    data: {

        labels: [
            "Promoções",
            "Usuários"
        ],

        datasets: [{

            data: [
                sentPromos,
                totalUsers
            ],

            backgroundColor: [
                "#38bdf8",
                "#22c55e"
            ],

            borderWidth: 0

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                labels: {

                    color: "white",

                    font: {
                        size: 16
                    }

                }

            }

        }

    }

});
