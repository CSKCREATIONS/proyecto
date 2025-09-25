const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// Crear producto
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, subcategory, sku } = req.body;

        if (!name || !description || !price || !category || !subcategory || !sku) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos obligatorios deben ser completados'
            });
        }

        const categoryExist = await Category.findById(category);
        if (!categoryExist) {
            return res.status(404).json({
                success: false,
                message: 'La categoría especificada no existe'
            });
        }

        const subcategoryExists = await Subcategory.findOne({
            _id: subcategory,
            category: category
        });

        if (!subcategoryExists) {
            return res.status(400).json({
                success: false,
                message: 'La subcategoría no existe o no pertenece a la categoría especificada'
            });
        }

        const product = new Product({
            name,
            description,
            price,
            sku: sku.toUpperCase(),
            category,
            subcategory,
            stock: stock || { quantity: 0, minstock: 0, trackStock: true }
        });

        if (req.user && req.user._id) {
            product.createdBy = req.user._id;
        }

        const savedProduct = await product.save();

        const productWithDetails = await Product.findById(savedProduct._id)
            .populate('category', 'name')
            .populate('subcategory', 'name');

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: productWithDetails
        });
    } catch (error) {
        console.error('Error en createProduct:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un producto con ese nombre o SKU'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: error.message
        });
    }
};

// Obtener todos los productos
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name') 
            .populate('subcategory', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error en getProducts:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos'
        });
    }
};

// Obtener producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name description')
            .populate('subcategory', 'name description');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error en getProductById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto'
        });
    }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, subcategory, sku } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (stock) updateData.stock = stock;
        if (sku) updateData.sku = sku.toUpperCase();

        if (category) {
            const categoryExist = await Category.findById(category);
            if (!categoryExist) {
                return res.status(404).json({
                    success: false,
                    message: 'La categoría especificada no existe'
                });
            }
            updateData.category = category;
        }

        if (subcategory) {
            const subcategoryExists = await Subcategory.findOne({
                _id: subcategory,
                category: category || updateData.category
            });

            if (!subcategoryExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Esta subcategoría no existe o no pertenece a la categoría'
                });
            }
            updateData.subcategory = subcategory;
        }

        if (req.user && req.user._id) {
            updateData.updatedBy = req.user._id;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )
        .populate('category', 'name')
        .populate('subcategory', 'name');

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error en updateProduct:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto'
        });
    }
};

// Desactivar producto
exports.deactivateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, { activo: false }, { new: true });
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Producto no encontrado' 
            });
        }
        res.status(200).json({ 
            success: true,
            message: 'Producto desactivado', 
            data: product 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error al desactivar producto', 
            error: error.message 
        });
    }
};

// Activar producto
exports.activateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(
            id,
            { activo: true },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Producto no encontrado' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Producto activado', 
            data: product 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error al activar el producto', 
            error: error.message 
        });
    }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto',
            error: error.message
        });
    }
};

// Toggle status de producto
exports.toggleStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Product.findById(id);
        if (!producto) {
            return res.status(404).json({ 
                success: false,
                message: 'Producto no encontrado' 
            });
        }

        const newStatus = !producto.isActive;
        
        const updatedProducto = await Product.findByIdAndUpdate(
            id, 
            { isActive: newStatus },
            { new: true }
        );

        res.status(200).json({ 
            success: true,
            message: `Producto ${newStatus ? 'activado' : 'desactivado'} correctamente`,
            data: updatedProducto
        });
    } catch (error) {
        console.error('Error al cambiar estado de producto:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al cambiar estado de producto', 
            error: error.message 
        });
    }
};

// Obtener estadísticas de productos
exports.getProductStats = async (req, res) => {
    try {
        const total = await Product.countDocuments();
        const active = await Product.countDocuments({ isActive: true });
        const inactive = total - active;

        res.status(200).json({
            success: true,
            data: {
                count: total,
                total,
                active,
                inactive
            }
        });
    } catch (error) {
        console.error('Error en getProductStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de productos'
        });
    }
};