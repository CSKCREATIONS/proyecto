const express = require('express');
const router = express.Router();
// Rutas del proyecto
const authRoutes = require('./auth');
const userRoutes = require('./user');
const roleRoutes = require('./role');
const categoryRoutes = require('./category');
const subcategoryRoutes = require('./subcategory');
const productRoutes = require('./Product');
const clienteRoutes = require('./cliente.routes');
const proveedorRoutes = require('./proveedores');
const cotizacionRoutes = require('./cotizacion.routes');
const pedidoRoutes = require('./pedido.routes');
const compraRoutes = require('./compra.routes');
const ventaRoutes = require('./venta.routes');

// Montar routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/products', productRoutes);
router.use('/clientes', clienteRoutes);
router.use('/proveedores', proveedorRoutes);
router.use('/cotizaciones', cotizacionRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/compras', compraRoutes);
router.use('/ventas', ventaRoutes);

// Ruta raíz de rutas
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Api funcionando correctamente',
        timestamp:new Date().toISOString(),
        version:'1.0.0'
    });
});

//propotciona documentacion basica sobre la api
router.get('/',(req,res) =>{
    res.status(200).json({
        success:true,
        message:'Bienvenido al la api timeda',
        version:'1.0.0',
        endpoints:{
            auth:'/api/auth',
            users:'/api/users',
            roles:'/api/roles',
            categories:'/api/categories',
            subcategories:'/api/subcategories',
            products:'/api/products',
            clientes:'/api/clientes',
            proveedores:'/api/proveedores',
            cotizaciones:'/api/cotizaciones',
            pedidos:'/api/pedidos',
            compras:'/api/compras',
            ventas:'/api/ventas'
        },
        documentation:{
            postman:'Importe la colecccion postman para probar todos los endpoints',
            authentication: 'use /api/auth/login para obtener el token JWT'
        }
    })
})

module.exports = router;

