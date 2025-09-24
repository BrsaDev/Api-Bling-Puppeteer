const puppeteer = require('puppeteer');

/**
 * Função para criar um pedido de compra no Bling
 * @param {Object} dadosPedido - Payload do pedido
 * @returns {Object} Resposta do Bling
 */
async function criarPedidoCompra(dadosPedido) {
  const browser = await puppeteer.launch({
    headless: true, // false = você vê o que está acontecendo
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Simula um navegador real
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
  );

  console.log('Acessando página de login do Bling...');
  await page.goto('https://www.bling.com.br/login', { waitUntil: 'networkidle0' });

  // Faz login
  await page.type('#username', process.env.BLING_USER);
  await page.type('#login > div > div.login-content.u-flex.u-flex-col.u-items-center > div > div.password-container.u-self-stretch > div > input', process.env.BLING_SENHA);

  await Promise.all([
    page.click('#login > div > div.login-content.u-flex.u-flex-col.u-items-center > div > button.Button.Button--primary.login-button.login-button-submit.u-justify-self-stretch.u-rounded-full'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  console.log('Login realizado, enviando pedido de compra...');

  // Envia o pedido para a API do Bling dentro do contexto logado
  const resposta = await page.evaluate(async (pedido) => {
    const url = 'https://www.bling.com.br/Api/v3/pedidos/compras';

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': 'https://www.bling.com.br',
        'Referer': 'https://www.bling.com.br/pedidos.compra.php',
        'X-Requested-With': 'XMLHttpRequest',
        'x-api-revision': '3.1.0'
      },
      body: JSON.stringify(pedido)
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  }, dadosPedido);

  await browser.close();
  return resposta;
}

module.exports = criarPedidoCompra;
