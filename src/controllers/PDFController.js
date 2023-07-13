const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const Boleto = require("../database/models/Boleto");
const pdfParse = require("pdf-parse");

async function ImportPDF(req, res) {
  const { file } = req;
  const boletos = await Boleto.findAll();

  const pdfBuffer = fs.readFileSync(file.path);
  const pdfContent = await PDFDocument.load(pdfBuffer);

  pdfParse(pdfBuffer)
    .then(async (pdfData) => {
      // Mapear e ordenar os boletos em ordem crescente por ID.
      const mapeamento = {};

      boletos.forEach((boleto) => {
        mapeamento[boleto.nome_sacado] = boleto.id;
      });
      boletos.sort((a, b) => a.id - b.id);

      // Ler o conteúdo do PDF
      const nomesNoPdf = pdfData.text
        .trim(" ")
        .split("\n")
        .filter((item) => item !== "");

      // Separar o PDF em vários
      for (let i = 0; i < pdfData.numpages; i++) {
        // A cada loop, busca o nome presente no pdf, na tabela boletos. Assim é possível nomear o PDF com o ID correspondente ao nome, e manter assim a ordem.//
        const boleto = boletos.find(
          (boleto) =>
            boleto.dataValues.nome_sacado.replace(/\s/g, "") === nomesNoPdf[i]
        );

        const novoPDF = await PDFDocument.create();
        const copiaPagina = await novoPDF.copyPages(pdfContent, [i]);
        novoPDF.addPage(copiaPagina[0]);

        // Gerar o nome do arquivo usando o ID do boleto
        const nomeArquivo = `${boleto.id}.pdf`;
        const caminhoArquivo = `boletos/${nomeArquivo}`;

        const novoPDFBytes = await novoPDF.save();
        fs.writeFileSync(caminhoArquivo, novoPDFBytes);
      }

      // Remover o arquivo PDF após o processamento
      fs.unlinkSync(file.path);

      return res
        .status(200)
        .json({ message: "Boletos do PDF distribuídos com sucesso" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        error: "Ocorreu um erro durante a distribuição dos boletos do PDF",
      });
    });
}

module.exports = ImportPDF;
