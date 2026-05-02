require('dotenv').config();
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const port = process.env.PORT || 3001;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const routeCategoria = require('./route/routeCategoria');
const routeProduto = require('./route/routeProduto');
const routeMovimentacao = require('./route/routeMovimentacao');

app.use('/', routeCategoria);
app.use('/', routeProduto);
app.use('/', routeMovimentacao);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
