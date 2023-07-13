const { DataTypes } = require("sequelize");
const db = require("../index");
const Lote = require("./Lote");

const MapeamentoUnidades = db.define("MapeamentoUnidades", {
  nome_unidade: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  LoteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lote,
      key: "id",
    },
  },
});

MapeamentoUnidades.belongsTo(Lote);

module.exports = MapeamentoUnidades;
