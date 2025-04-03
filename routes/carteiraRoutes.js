const express = require("express");
const router = express.Router();
const CarteiraController = require("../controllers/carteiraController");
const { verificarToken} = require("../middlewares/authMiddleware"); // Para proteger as rotas

// Rotas protegidas pelo middleware de autenticação
router.get("/saldo",verificarToken,  CarteiraController.consultarSaldo);
router.post("/saque",verificarToken,  CarteiraController.solicitarSaque);
router.get("/historico",verificarToken,  CarteiraController.historicoTransacoes);

module.exports = router;
