const express = require("express");
const routes = require("./routes");
const db = require("./database/index");
require("./database/index");

const app = express();
app.use(express.json());
app.use(routes);

// verificar se os models do projeto são iguais ao banco.
// caso não exista no banco, cria-las.
const Lote = require("./database/models/Lote");
const Boleto = require("./database/models/Boleto");
const MapeamentoUnidades = require("./database/models/MapeamentoUnidades");
db.sync();

// iniciando servidor
app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
