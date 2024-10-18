import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fechaVenta, fechaFin } = req.body;
    try {
      const response = await axios.post('http://localhost:5000/buscar', { fechaVenta, fechaFin });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el producto más vendido' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
