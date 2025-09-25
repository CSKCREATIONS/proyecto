const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Crear subcategoría
exports.createSubcategory = async (req, res) => {
    try {
        const { name, description, category } = req.body;

        // Validar que la categoría exista 
        const parentCategory = await Category.findById(category);
        if (!parentCategory) {
            return res.status(404).json({
                success: false,
                message: 'La categoría no existe'
            });
        }

        const newSubcategory = new Subcategory({
            name: name.trim(),
            description: description?.trim(),
            category,
            createdBy: req.user._id
        });

        await newSubcategory.save();

        res.status(201).json({
            success: true,
            message: 'Subcategoría creada exitosamente',
            data: newSubcategory
        });

    } catch (error) {
        console.error('Error al crear la subcategoría: ', error);

        if (error.message.includes('duplicate key') || error.message.includes('ya existe ')) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una subcategoría con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Error al crear subcategoría'
        });
    }
};

// Obtener todas las subcategorías
exports.getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category', 'name');
        res.status(200).json({
            success: true,
            data: subcategories
        });
        
    } catch (error) {
        console.error('Error al obtener subcategorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener subcategorías'
        });
    }
};

// Obtener subcategoría por ID
exports.getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate('category', 'name');

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategoría no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: subcategory
        });
    } catch (error) {
        console.error('Error al obtener la subcategoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la subcategoría'
        });
    }
};
        

// Actualizar subcategoría
exports.updateSubcategory = async (req, res) => {
    try {
        const { name, description, category } = req.body;

        // Verificar si se cambia la categoría
        if (category) {
            const parentCategory = await Category.findById(category);
            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'La categoría no existe'
                });
            }
        }

        const updateSubcategory = await Subcategory.findByIdAndUpdate(req.params.id,
            {
                name: name ? name.trim() : undefined,
                description: description ? description.trim() : undefined,
                category,
                updatedBy: req.user._id
            }, { new: true, runValidators: true }
        );

        if (!updateSubcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subcategoría actualizada',
            data: updateSubcategory
        });

    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la subcategoría'
        });
    }
};

// Eliminar subcategoría
exports.deleteSubcategory = async (req, res) => {
    try {
        const deleteSubcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!deleteSubcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategoría no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Subcategoría eliminada'
        });

    } catch (error) {
        console.error('Error al eliminar subcategoría', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar subcategoría'
        });
    }
};// Desactivar subcategoría y productos
exports.desactivarSubcategoriaYProductos = async (req, res) => {
    const { id } = req.params;

    try {
        const subcategoria = await Subcategory.findByIdAndUpdate(id, { activo: false });
        if (!subcategoria) {
            return res.status(404).json({ 
                success: false,
                message: 'Subcategoría no encontrada' 
            });
        }

        // Desactivar productos de esta subcategoría
        const result = await Product.updateMany({ subcategory: id }, { activo: false });
        console.log('Productos desactivados:', result.modifiedCount);

        res.status(200).json({ 
            success: true,
            message: 'Subcategoría y productos desactivados correctamente' 
        });
    } catch (error) {
        console.error('Error al desactivar subcategoría:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al desactivar subcategoría', 
            error: error.message 
        });
    }
};

// Activar subcategoría y productos
exports.activarSubcategoriaYProductos = async (req, res) => {
    const { id } = req.params;

    try {
        const subcategoria = await Subcategory.findByIdAndUpdate(id, { activo: true });
        if (!subcategoria) {
            return res.status(404).json({ 
                success: false,
                message: 'Subcategoría no encontrada' 
            });
        }

        // Activar productos de esta subcategoría
        const result = await Product.updateMany({ subcategory: id }, { activo: true });
        console.log('Productos activados:', result.modifiedCount);

        res.status(200).json({ 
            success: true,
            message: 'Subcategoría y productos activados correctamente' 
        });
    } catch (error) {
        console.error('Error al activar subcategoría:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al activar subcategoría', 
            error: error.message 
        });
    }
};

// Toggle status de subcategoría y productos
exports.toggleStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const subcategoria = await Subcategory.findById(id);
        if (!subcategoria) {
            return res.status(404).json({ 
                success: false,
                message: 'Subcategoría no encontrada' 
            });
        }

        const newStatus = !subcategoria.isActive;
        
        const updatedSubcategoria = await Subcategory.findByIdAndUpdate(
            id, 
            { isActive: newStatus },
            { new: true }
        );

        // Actualizar productos de esta subcategoría
        await Product.updateMany(
            { subcategory: id }, 
            { isActive: newStatus }
        );

        res.status(200).json({ 
            success: true,
            message: `Subcategoría ${newStatus ? 'activada' : 'desactivada'} correctamente`,
            data: updatedSubcategoria
        });
    } catch (error) {
        console.error('Error al cambiar estado de subcategoría:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al cambiar estado de subcategoría', 
            error: error.message 
        });
    }
};

// Obtener estadísticas de subcategorías
exports.getSubcategoryStats = async (req, res) => {
    try {
        const total = await Subcategory.countDocuments();
        const active = await Subcategory.countDocuments({ isActive: true });
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
        console.error('Error en getSubcategoryStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de subcategorías'
        });
    }
};