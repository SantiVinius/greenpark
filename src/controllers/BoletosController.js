const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");
const { Op } = require("sequelize");

const Boleto = require("../database/models/Boleto");

async function GetBoletos(req, res) {
  try {
    const { nome, valor_inicial, valor_final, id_lote, relatorio } = req.query;

    if (relatorio && relatorio === "1") {
      const boletos = await Boleto.findAll();
      // Criar um novo documento PDF
      const doc = await PDFDocument.create();
      const page = doc.addPage();

      // Definir as informações da tabela
      const table = {
        headers: ["ID", "Nome Sacado", "ID Lote", "Valor", "Linha Digitável"],
        rows: [],
      };

      // Preencher a tabela com os dados dos boletos
      boletos.forEach((boleto) => {
        const rowData = [
          String(boleto.id),
          boleto.nome_sacado,
          String(boleto.LoteId),
          String(boleto.valor),
          boleto.linha_digitavel,
        ];
        table.rows.push(rowData);
      });

      // Definir a posição inicial da tabela
      const startX = 50;
      const startY = page.getHeight() - 50;
      const rowHeight = 20;
      const columnWidth = (page.getWidth() - 2 * startX) / table.headers.length;

      // Desenhar as células de cabeçalho da tabela
      table.headers.forEach((header, columnIndex) => {
        const cellX = startX + columnIndex * columnWidth;
        const cellY = startY;
        page.drawText(header, {
          x: cellX,
          y: cellY,
          size: 12,
          color: rgb(0, 0, 0),
        });
      });

      // Desenhar as células de dados da tabela
      table.rows.forEach((rowData, rowIndex) => {
        rowData.forEach((cell, columnIndex) => {
          const cellX = startX + columnIndex * columnWidth;
          const cellY = startY - (rowIndex + 1) * rowHeight;
          page.drawText(cell, {
            x: cellX,
            y: cellY,
            size: 10,
            color: rgb(0, 0, 0),
          });
        });
      });

      // Converter o PDF para base64
      const pdfBytes = await doc.save();

      // Gerar o PDF para testar
      fs.writeFileSync("relatorio.pdf", pdfBytes);

      // Converter para base64
      const base64 = fs.readFileSync("relatorio.pdf", { encoding: "base64" });
      return res.status(200).json({ base64 });
    }

    const filtros = {};

    // Verificar se o filtro de nome está presente
    if (nome) {
      filtros.nome_sacado = {
        [Op.like]: `%${nome}%`,
      };
    }

    // Verificar se os filtros de valor estão presentes
    if (valor_inicial && valor_final) {
      filtros.valor = {
        [Op.between]: [valor_inicial, valor_final],
      };
    } else if (valor_inicial) {
      filtros.valor = {
        [Op.gte]: valor_inicial,
      };
    } else if (valor_final) {
      filtros.valor = {
        [Op.lte]: valor_final,
      };
    }

    // Verificar se o filtro de id_lote está presente
    if (id_lote) {
      filtros.LoteId = id_lote;
    }

    // Consultar os boletos com os filtros
    const boletos = await Boleto.findAll({
      where: filtros,
    });

    return res.status(200).json(boletos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao obter os boletos" });
  }
}

module.exports = GetBoletos;
