const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const routeCategoria = require('./route/routeCategoria');
const routeProduto = require('./route/routeProduto');

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use('/', routeCategoria);
app.use('/', routeProduto);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
