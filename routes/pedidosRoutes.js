const express = require('express');
const router = express.Router();
const { criarPedido } = require('../controllers/pedidosController');

// Rota para criar pedido de compra
router.post('/pedidos', criarPedido);

module.exports = router;
