const User = require('./User');
const Role = require('./Role');
const Category = require('./Category');
const Subcategory = require('./Subcategory');
const Product = require('./Product');
const Cliente = require('./Cliente');
const Proveedor = require('./proveedores');
const Cotizacion = require('./cotizaciones');
const Pedido = require('./Pedido');
const Compra = require('./compras');
const Venta = require('./venta');

//permite importar los modelos en un solo lugar
module.exports = {
    User,
    Role,
    Category,
    Subcategory,
    Product,
    Cliente,
    Proveedor,
    Cotizacion,
    Pedido,
    Compra,
    Venta,
};