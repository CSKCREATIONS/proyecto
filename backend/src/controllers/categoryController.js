const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');

// Obtener todas las categorías
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error en getCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías'
        });
    }
};

// Obtener categoría por ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error en getCategoryById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categoría'
        });
    }
};

// Crear categoría
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validación
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es obligatorio y debe ser texto válido'
            });
        }
        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'La descripción es obligatoria y debe ser texto válido'
            });
        }

        const trimmedName = name.trim();
        const trimmedDesc = description.trim();

        // Verificar si ya existe la categoría
        const existingCategory = await Category.findOne({ name: trimmedName });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        const newCategory = new Category({
            name: trimmedName,
            description: trimmedDesc,
            createdBy: req.user._id
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: newCategory
        });

    } catch (error) {
        console.error('Error en createCategory:', error);
        // Manejo específico de error de duplicados
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear categoría',
            error: error.message
        });
    }
};
// Actualizar categoría
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updateData = {};
        
        if (name) {
            updateData.name = name.trim();
            // Verificar si el nuevo nombre ya existe
            const existing = await Category.findOne({
                name: updateData.name,
                _id: { $ne: req.params.id }
            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe una categoría con ese nombre'
                });
            }
        }
        if (description) {
            updateData.description = description.trim();
        }
        
        // Agregar el usuario que actualiza
        updateData.updatedBy = req.user._id;

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoría actualizada',
            data: updatedCategory
        });

    } catch (error) {
        console.error('Error en updateCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar categoría'
        });
    }
};

// Eliminar categoría 
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        // Verificar si hay subcategorías o productos asociados
        const subcategories = await Subcategory.find({ category: req.params.id });
        if (subcategories.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar la categoría porque tiene subcategorías asociadas'
            });
        }

        const products = await Product.find({ category: req.params.id });
        if (products.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar la categoría porque tiene productos asociados'
            });
        }

        await Category.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Categoría eliminada correctamente'
        });
    } catch (error) {
        console.error('Error en deleteCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar categoría'
        });
    }
};

// DESACTIVAR Categoría + Subcategorías + Productos
exports.desactivarCategoriaYRelacionados = async (req, res) => {
    const { id } = req.params;

    try {
        // Desactivar categoría
        const category = await Category.findByIdAndUpdate(id, { activo: false });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        // Obtener y desactivar subcategorías
        const subcategorias = await Subcategory.find({ category: id });

        for (const sub of subcategorias) {
            await Subcategory.findByIdAndUpdate(sub._id, { activo: false });

            // Desactivar productos de cada subcategoría
            const productos = await Product.find({ subcategory: sub._id });
            console.log(`Productos encontrados para sub ${sub.name}:`, productos.length);

            const result = await Product.updateMany({ subcategory: sub._id }, { activo: false });
            console.log('Productos desactivados:', result.modifiedCount);
        }

        res.status(200).json({ 
            success: true,
            message: 'Categoría y elementos relacionados desactivados correctamente' 
        });
    } catch (error) {
        console.error('Error al desactivar:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al desactivar la categoría', 
            error: error.message 
        });
    }
};

// ACTIVAR Categoría + Subcategorías + Productos
exports.activarCategoriaYRelacionados = async (req, res) => {
    const { id } = req.params;

    try {
        // Activar categoría
        const categoria = await Category.findByIdAndUpdate(id, { activo: true }, { new: true });
        if (!categoria) {
            return res.status(404).json({ 
                success: false,
                message: 'Categoría no encontrada' 
            });
        }

        // Obtener y activar subcategorías
        const subcategorias = await Subcategory.find({ category: id });

        for (const sub of subcategorias) {
            await Subcategory.findByIdAndUpdate(sub._id, { activo: true });

            // Activar productos de cada subcategoría
            const productos = await Product.find({ subcategory: sub._id });
            console.log(`Activando ${productos.length} productos de sub ${sub.name}`);

            const result = await Product.updateMany({ subcategory: sub._id }, { activo: true });
            console.log('Productos activados:', result.modifiedCount);
        }

        res.status(200).json({ 
            success: true,
            message: 'Categoría y elementos relacionados activados correctamente' 
        });
    } catch (error) {
        console.error('Error al activar:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al activar la categoría', 
            error: error.message 
        });
    }
};

// Toggle status de categoría y elementos relacionados
exports.toggleStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const categoria = await Category.findById(id);
        if (!categoria) {
            return res.status(404).json({ 
                success: false,
                message: 'Categoría no encontrada' 
            });
        }

        const newStatus = !categoria.isActive;
        
        const updatedCategoria = await Category.findByIdAndUpdate(
            id, 
            { isActive: newStatus },
            { new: true }
        );

        // Actualizar subcategorías y productos relacionados
        await Subcategory.updateMany(
            { category: id }, 
            { isActive: newStatus }
        );
        
        await Product.updateMany(
            { category: id }, 
            { isActive: newStatus }
        );

        res.status(200).json({ 
            success: true,
            message: `Categoría ${newStatus ? 'activada' : 'desactivada'} correctamente`,
            data: updatedCategoria
        });
    } catch (error) {
        console.error('Error al cambiar estado de categoría:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al cambiar estado de categoría', 
            error: error.message 
        });
    }
};

// Obtener estadísticas de categorías
exports.getCategoryStats = async (req, res) => {
    try {
        const total = await Category.countDocuments();
        const active = await Category.countDocuments({ isActive: true });
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
        console.error('Error en getCategoryStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de categorías'
        });
    }
};