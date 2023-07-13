const fs = require("fs");
const csv = require("csv-parser");

const MapeamentoUnidades = require("../database/models/MapeamentoUnidades");
const Boleto = require("../database/models/Boleto");

async function ImportCSV(req, res) {
  try {
    const { file } = req;
    const results = [];

    fs.createReadStream(file.path)
      .pipe(csv({ separator: ";" }))
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        // Processar os dados do arquivo CSV
        const boletos = [];

        for (const row of results) {
          const { nome_sacado, unidade, valor, linha_digitavel } = row;

          // Consultar o mapeamento para obter o ID do lote correspondente ao nome da unidade
          const mapeamento = await MapeamentoUnidades.findOne({
            where: { nome_unidade: unidade },
          });

          if (!mapeamento) {
            return res.status(400).json({
              error: `Mapeamento para a unidade ${unidade} não encontrado`,
            });
          }

          // Criar um novo boleto e associá-lo ao lote correspondente
          const novoBoleto = await Boleto.create({
            nome_sacado,
            valor,
            linha_digitavel,
            ativo: true,
            LoteId: mapeamento.dataValues.LoteId,
          });

          boletos.push(novoBoleto);
        }

        // Remover o arquivo CSV após o processamento
        fs.unlinkSync(file.path);

        return res
          .status(200)
          .json({ message: "Boletos importados com sucesso", boletos });
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro durante a importação dos boletos" });
  }
}

module.exports = ImportCSV;
