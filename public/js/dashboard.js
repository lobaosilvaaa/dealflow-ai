const body =
    document.body;

// 📊 Dados iniciais
const promos =
    Number(
        body.dataset.promos
    );

const users =
    Number(
        body.dataset.users
    );

// 📈 Canvas chart
const ctx =
    document.getElementById(
        "promoChart"
    );

// 🚀 Inicializa gráfico
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

                borderWidth: 0,

            }]

        },

        options: {

            responsive: true,

            animation: {

                duration: 500

            },

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

// 📡 Métricas realtime
socket.on("live-metrics", data => {

    try {

        // 🛡️ Validação defensiva
        if (

            typeof data.promos !== "number" ||
            typeof data.users !== "number"

        ) {

            return;

        }

        // 📊 Atualiza gráfico
        chart.data.datasets[0].data = [

            data.promos,
            data.users

        ];

        chart.update();

        // 📦 Atualiza cards
        document.getElementById(
            "promosCount"
        ).innerText =
            data.promos;

        document.getElementById(
            "usersCount"
        ).innerText =
            data.users;

        document.getElementById(
            "uptimeCount"
        ).innerText =
            `${data.uptime}s`;

    } catch (error) {

        console.log(
            "Erro realtime frontend:",
            error.message
        );

    }

});

// 🔌 Socket conectado
socket.on("connect", () => {

    console.log(
        "🟢 Realtime conectado"
    );

});

// 🔌 Socket desconectado
socket.on("disconnect", () => {

    console.log(
        "🔴 Realtime desconectado"
    );

});