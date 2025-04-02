const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

// Rota de cadastro de empresa
router.post('/register', empresaController.registerEmpresa);

// Rota de login de empresa
router.post('/login', empresaController.loginEmpresa);

module.exports = router;
