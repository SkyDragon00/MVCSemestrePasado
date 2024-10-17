const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

// Endpoints API
server.get('/api/ventas', (req, res) => {
  // Aquí va la lógica para devolver ventas
  res.json({ message: 'Ventas' });
});

server.all('*', (req, res) => {
  return handle(req, res);
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log('Server running on http://localhost:3000');
});
