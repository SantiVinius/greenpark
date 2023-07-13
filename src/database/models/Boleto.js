const { DataTypes } = require("sequelize");
const db = require("../index");
const Lote = require("./Lote");

const Boleto = db.define("Boleto", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_sacado: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  linha_digitavel: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

Boleto.belongsTo(Lote);

module.exports = Boleto;
