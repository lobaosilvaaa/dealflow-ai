require("dotenv").config();
const express = require("express");

const { processMessage } = require("./src/core/bot");

const app = express();

app.get("/", async (req, res) => {
    const resposta = await processMessage("web-user", "menu");
    res.send(resposta);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});