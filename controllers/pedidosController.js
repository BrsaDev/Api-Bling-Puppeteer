const criarPedidoCompra = require('../services/criarPedidoCompra');

/**
 * Controller para criar pedido de compra
 */
const criarPedido = async (req, res) => {
  try {
    const dadosPedido = req.body;

    if (!dadosPedido || !dadosPedido.itens || dadosPedido.itens.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Dados do pedido inválidos. É necessário enviar ao menos 1 item.'
      });
    }

    console.log('Recebendo pedido para criar no Bling:', dadosPedido);

    const respostaBling = await criarPedidoCompra(dadosPedido);

    return res.status(200).json({
      success: true,
      message: 'Pedido de compra enviado com sucesso.',
      data: respostaBling
    });

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao criar pedido no Bling.',
      details: error.message
    });
  }
};

module.exports = { criarPedido };
