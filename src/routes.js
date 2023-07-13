const { Router } = require("express");
const multer = require("multer");

const ImportCSV = require("./controllers/ImportCSVController");
const ImportPDF = require("./controllers/PDFController");
const GetBoletos = require("./controllers/BoletosController");

const router = Router();
const upload = multer({ dest: "uploads/" });

// importar os boletos do csv
router.post("/import", upload.single("file"), ImportCSV);

// exportar boletos do pdf
router.post("/pdf", upload.single("file"), ImportPDF);

// retornar todos os boletos existentes, com alguns filtros + relatório
router.get("/boletos", GetBoletos);

module.exports = router;
