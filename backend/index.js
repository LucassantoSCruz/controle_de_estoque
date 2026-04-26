const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const routeCategoria = require('./route/routeCategoria');
const routeProduto = require('./route/routeProduto');
const routeMovimentacao = require('./route/routeMovimentacao');

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use('/', routeCategoria);
app.use('/', routeProduto);
app.use('/', routeMovimentacao);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
