require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const {MongoClient , ObjectId} =  require ('mongodb');




//Importar Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const clientesRoutes = require('./routes/clientesRoutes'); // Ruta base para clientes
const ventaRoutes = require('./routes/ventasRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const comprasRoutes = require('./routes/comprasRoutes'); // Ruta base para compras

const mongoClient = new MongoClient(process.env.MONGODB_URI);
(async()=>{
    await mongoClient.connect();
    app.set('mongoDB',mongoClient.db());
    console.log('Conexion directa a mongoDB establecida');
})();
const app = express();

//Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Conexion a mongo
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('OK MongoDB conectado'))
.catch(err => console.error('X error de mongoDB',err));

//rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/clientes', clientesRoutes); // Ruta base para clientes
app.use('/api/ventas', ventaRoutes); // Ruta base para ventas
app.use('/api/proveedores', proveedorRoutes); // Ruta base para proveedores
app.use('/api/compras', comprasRoutes); // Ruta base para compras


//Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
