const body =
    document.body;

const promos =
    Number(
        body.dataset.promos
    );

const users =
    Number(
        body.dataset.users
    );

const ctx =
    document
        .getElementById(
            "promoChart"
        );

const chart =
    new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Promoções",
                "Usuários"

            ],

            datasets: [{

                data: [

                    promos,
                    users

                ],

                backgroundColor: [

                    "#38bdf8",
                    "#22c55e"

                ],

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    labels: {

                        color: "white"

                    }

                }

            }

        }

    });

// 🔌 Socket realtime
const socket = io();

socket.on("live-metrics", data => {

    chart.data.datasets[0].data = [

        data.promos,
        data.users

    ];

    chart.update();

});