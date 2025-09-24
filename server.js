require('dotenv').config();
const express = require('express');
const pedidosRoutes = require('./routes/pedidosRoutes');

const app = express();
const PORT = process.env.PORT || 3030;

// Middleware para tratar JSON
app.use(express.json());

// Rotas
app.use('/api', pedidosRoutes);

app.get('/', (req, res) => {
  res.send('API de integração com Bling rodando...');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
