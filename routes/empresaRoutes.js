const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

//cadastro de empresa
router.post('/register', empresaController.registerEmpresa);

//login de empresa
router.post('/login', empresaController.loginEmpresa);

module.exports = router;
