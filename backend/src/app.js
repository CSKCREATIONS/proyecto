require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { errorHandler, noFound } = require('./middleware/errorHandler');

const apiRoutes = require('./routes');

const app = express();

app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'exp://192.168.1.3:8081',
        'exp://192.168.1.3:8082',
        'exp://192.168.1.3:8083',
        'http://192.168.1.3:8081',
        'http://192.168.1.3:8082',
        'http://192.168.1.3:8083',
        'http://localhost:8081',
        'http://localhost:8082',
        'http://localhost:8083',
    ],
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
        next();
    })
}

//
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    console.log(' GET / peticion recibida desde', req.ip);
    res.status(200).json({
        success: true,
        message: 'Servidor del API de gestion de productos ',
        version: '1.0.0',
        status: 'running',
        timestamps: new Date,
        clientIP: req.ip
    });
});

app.use(noFound);
app.use(errorHandler);

// Conexion con la base de datos
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB conectado: ${conn.connection.host}`);  
    } catch (error) {
        // Si la conexion falla
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};
// Iniciando servido
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        const HOST = process.env.HOST || '192.168.1.3';

        app.listen(PORT, HOST, () => {
            console.log(`
                Servidor iniciado
                puerto: ${PORT.toString().padEnd(49)} ||
                Modo: ${(process.env.NODE_ENV || 'development').padEnd(51)} ||
                URL Local: http://localhost:${PORT.toString().padEnd(37)} ||
                URL Red: http://${HOST}:${PORT.toString().padEnd(37)} ||

                Endpoints disponibles:
                * Get / - informacion del servidor
                * Post /api - Info de api
                * Post /api/auth/login  - Login 
                * Get /api/users - Gestion de usuarios
                * Get /api/categories - Gestion de categorias
                * Get /api/subcategories - Gestion de subcategorias
                * Get /api/products - Gestion de productos
                
                DOCUMENTACION DE POSTMAN

                `);
        });
    } catch (error) {
        console.error('Error iniciando el servidor:', error.message);
        process.exit(1);
    }
};

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err.message);
    process.exit(1);
});

// Inicia el servidor
startServer();

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor gracefull...');
    mongoose.connection.close(() => {
        console.log('Conexion a mongoDB cerrada');
        process.exit(0);
    });
});
module.exports = app; 