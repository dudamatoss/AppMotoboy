const express = require('express');
const router = express.Router();
const motoboyController = require('../controllers/motoboyController');

// Rota de cadastro de motoboy
router.post('/register', motoboyController.registerMotoboy);

// Rota de login de motoboy
router.post('/login', motoboyController.loginMotoboy);

module.exports = router;
