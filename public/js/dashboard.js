// 🚀 DealFlowAI Dashboard Realtime

const body =
    document.body;

// 📊 Dados iniciais
const promos =
    Number(
        body.dataset.promos || 0
    );

const users =
    Number(
        body.dataset.users || 0
    );

// 📈 Canvas chart
const ctx =
    document.getElementById(
        "promoChart"
    );

// 🛡️ Verifica canvas
if (!ctx) {

    console.error(
        "Canvas promoChart não encontrado"
    );

}

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

                hoverBackgroundColor: [

                    "#0ea5e9",
                    "#16a34a"

                ],

                borderWidth: 0,

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                duration: 600

            },

            plugins: {

                legend: {

                    labels: {

                        color: "white",

                        font: {

                            size: 14

                        }

                    }

                },

                tooltip: {

                    enabled: true,

                    backgroundColor:
                        "#0f172a",

                    titleColor:
                        "#38bdf8",

                    bodyColor:
                        "#ffffff",

                    borderColor:
                        "#38bdf8",

                    borderWidth: 1,

                }

            }

        }

    });

// 🔌 Socket realtime
const socket = io({

    transports: [

        "websocket",
        "polling"

    ]

});

// 🟢 Estado conexão
let isConnected = false;

// 📡 Atualiza métricas realtime
socket.on("live-metrics", data => {

    try {

        // 🛡️ Validação defensiva
        if (

            typeof data.promos !== "number" ||
            typeof data.users !== "number"

        ) {

            console.warn(
                "Payload inválido:",
                data
            );

            return;

        }

        // 📊 Atualiza gráfico
        chart.data.datasets[0].data = [

            data.promos,
            data.users

        ];

        chart.update();

        // 📦 Atualiza cards
        updateText(

            "promosCount",

            data.promos

        );

        updateText(

            "usersCount",

            data.users

        );

        updateText(

            "uptimeCount",

            `${data.uptime}s`

        );

    } catch (error) {

        console.error(

            "Erro realtime frontend:",

            error.message

        );

    }

});

// 📜 Logs realtime
socket.on("new-log", data => {

    try {

        const logsContainer =
            document.getElementById(
                "logsContainer"
            );

        // 🛡️ Verifica container
        if (!logsContainer) {

            return;

        }

        // 🚀 Cria log
        const logItem =
            document.createElement("div");

        logItem.classList.add(
            "log-item"
        );

        logItem.style.animation =
            "fadeIn 0.35s ease";

        // 🎨 Cor dinâmica
        if (

            data.level === "error"

        ) {

            logItem.style.borderLeft =
                "4px solid #ef4444";

        }

        else if (

            data.level === "warn"

        ) {

            logItem.style.borderLeft =
                "4px solid #f59e0b";

        }

        else {

            logItem.style.borderLeft =
                "4px solid #38bdf8";

        }

        // 📦 HTML log
        logItem.innerHTML = `

            <span class="log-time">
                [${data.timestamp}]
            </span>

            ${escapeHtml(
            data.message
        )}

        `;

        // 🚀 Insere topo
        logsContainer.prepend(
            logItem
        );

        // 🔥 Limita logs
        while (

            logsContainer.children.length > 10

        ) {

            logsContainer.removeChild(

                logsContainer.lastChild

            );

        }

    } catch (error) {

        console.error(

            "Erro logs realtime:",

            error.message

        );

    }

});

// 🟢 Socket conectado
socket.on("connect", () => {

    isConnected = true;

    console.log(
        "🟢 Realtime conectado"
    );

    showToast(
        "🟢 Realtime conectado",
        "success"
    );

});

// 🔴 Socket desconectado
socket.on("disconnect", () => {

    isConnected = false;

    console.log(
        "🔴 Realtime desconectado"
    );

    showToast(
        "🔴 Realtime desconectado",
        "error"
    );

});

// ⚠️ Socket erro
socket.on("connect_error", error => {

    console.error(

        "Erro Socket.IO:",

        error.message

    );

});

// 🚀 Atualiza texto seguro
function updateText(

    id,
    value

) {

    const element =
        document.getElementById(id);

    if (!element) {

        return;

    }

    element.innerText =
        value;

}

// 🛡️ Escape HTML
function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.innerText =
        text;

    return div.innerHTML;

}

// 🔥 Toast simples
function showToast(

    message,
    type = "info"

) {

    const toast =
        document.createElement("div");

    toast.innerText =
        message;

    toast.style.position =
        "fixed";

    toast.style.bottom =
        "20px";

    toast.style.right =
        "20px";

    toast.style.padding =
        "14px 18px";

    toast.style.borderRadius =
        "12px";

    toast.style.zIndex =
        "9999";

    toast.style.fontWeight =
        "bold";

    toast.style.color =
        "white";

    toast.style.boxShadow =
        "0 0 20px rgba(0,0,0,0.3)";

    toast.style.animation =
        "fadeIn 0.3s ease";

    // 🎨 Tipo
    if (type === "success") {

        toast.style.background =
            "#22c55e";

    }

    else if (type === "error") {

        toast.style.background =
            "#ef4444";

    }

    else {

        toast.style.background =
            "#38bdf8";

    }

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

// 🚀 Heartbeat frontend
setInterval(() => {

    if (!isConnected) {

        console.warn(
            "Realtime offline..."
        );

    }

}, 10000);