const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();
const PORT = 5000;
app.use(cors()); // Agrega esta línea para habilitar CORS

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas
mongoose
  .connect('mongodb+srv://admin:admin@cluster0.7gu4h.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Conexión exitosa a MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB Atlas:', error);
  });

// Definición del esquema de usuario
const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
});

// Modelo de usuario
const Usuario = mongoose.model('Usuario', usuarioSchema);


// Definición del esquema de venta
const ventaSchema = new mongoose.Schema({
    fechaVenta: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    producto: { type: String, required: true },
    monto: { type: Number, required: true },
});

// Modelo de venta
const Venta = mongoose.model('Venta', ventaSchema);

//Ruta para buscar 
// Ruta para buscar el producto más vendido por fecha y vendedor
app.post('/buscar', async (req, res) => {
    const { fechaVenta, fechaFin } = req.body; // Obtener las fechas del body
    console.log('Fechas recibidas:', fechaVenta, fechaFin);

    try {
        // Convertir las fechas a objetos Date para comparación
        const fechaInicioDate = new Date(fechaVenta);
        const fechaFinDate = new Date(fechaFin);

        // Verificar si ambas fechas son válidas
        if (isNaN(fechaInicioDate) || isNaN(fechaFinDate)) {
            return res.status(400).json({ error: 'Fechas inválidas proporcionadas' });
        }

        // Obtener todas las ventas
        const ventas = await Venta.find().populate('vendedor', 'nombre');

        // Bucle para registrar las comparaciones
        const ventasFiltradas = [];
        for (let venta of ventas) {
            const fechaVenta = new Date(venta.fechaVenta);

            // Registrar en consola la comparación de fechas
            console.log(`Comparando: ${fechaVenta} >= ${fechaInicioDate} && ${fechaVenta} < ${fechaFinDate}`);

            if (fechaVenta >= fechaInicioDate && fechaVenta < fechaFinDate) {
                console.log('Venta válida:', venta); // Log de ventas válidas
                ventasFiltradas.push(venta); // Agregar la venta filtrada si cumple la condición
            } else {
                console.log('Venta fuera del rango:', venta); // Log de ventas fuera del rango
            }
        }

        // Verificar si no se encontraron ventas en el rango
        if (ventasFiltradas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ventas en el rango de fechas proporcionado.' });
        }

        // Encontrar la venta con el monto más alto
        let ventaConMayorMonto = ventasFiltradas[0]; // Asumimos que la primera venta es la de mayor monto inicialmente

        for (let venta of ventasFiltradas) {
            console.log(`Comparando montos: ${venta.monto} > ${ventaConMayorMonto.monto}`);
            if (venta.monto > ventaConMayorMonto.monto) {
                ventaConMayorMonto = venta; // Actualizar si encontramos una venta con mayor monto
            }
        }

        // Log de la venta con el monto más alto
        console.log('Venta con el monto más alto:', ventaConMayorMonto);

        // Retornar la venta con el monto más alto
        res.json(ventaConMayorMonto);

        // Retornar las ventas filtradas
        //res.json(ventasFiltradas);
        //console.log("respuesta size: " + ventasFiltradas.length)
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        res.status(500).json({ error: 'Error al obtener las ventas', message: error.message });
    }
});








// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    Usuario.find()
        .then((usuarios) => {
            res.json(usuarios);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        });
});

// Ruta para crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
    try {
        const usuario = new Usuario(req.body);
        await usuario.save();
        res.send({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).send(error);

    }
});


// Ruta para obtener todas las ventas
app.get('/ventas', (req, res) => {
    Venta.find()
        .populate('vendedor', 'nombre')
        .then((ventas) => {
            res.json(ventas);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al obtener las ventas' });
        });
});

// Ruta para crear una nueva venta
app.post('/ventas', async (req, res) => {
    try {
        const venta = new Venta(req.body);
        await venta.save();
        res.send({ message: 'Venta creada exitosamente' });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
