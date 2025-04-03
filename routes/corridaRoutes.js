const express = require('express');
const router = express.Router();
const corridaController = require('../controllers/corridaController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rota para solicitar uma nova corrida (empresa)
router.post('/solicitar', verificarToken, corridaController.criarCorrida);

// Rota para listar corridas pendentes (motoboy pode ver as disponíveis)
router.get('/pendentes', corridaController.listarCorridasPendentes);

// Rota para aceitar uma corrida (motoboy)
router.put('/aceitar/:id', verificarToken, corridaController.aceitarCorrida);

// Rota para atualizar status da corrida (concluir ou cancelar)
router.put('/status/:id', verificarToken, corridaController.atualizarStatusCorrida);

module.exports = router;
