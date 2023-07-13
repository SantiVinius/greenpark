const { Sequelize } = require("sequelize");

const db = new Sequelize("greenpark", "postgres", "Adm1@*", {
  host: "localhost",
  dialect: "postgres",
});

// conexão com o banco
db.authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error connecting database"));

module.exports = db;
