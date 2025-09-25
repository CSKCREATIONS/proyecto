const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'El nombre de la subcategoría es requerido'],
        trim: true,
        minlength: [2,'El nombre debe tener al menos 2 caracteres'],
        maxlength: [100,'El nombre no puede exceder los 100 caracteres'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500,'La descripción no puede exceder los 500 caracteres'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true,'La categoría es requerida'],
        validate: {
            validator: async function(categoryId) {
                const Category = mongoose.model('Category');
                const category = await Category.findById(categoryId);
                return category && category.isActive;
            },
            message: 'La categoría debe existir y estar activa',
        }
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    icon: {
        type: String,
        trim: true,
    },
    color: {
        type: String,
        trim: true,
        match: [/^#([0-9A-F]{6}){1,2}$/i,'El color debe ser un código hexadecimal válido'],
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{
    timestamps: true,
});

// Generar slug automático
subcategorySchema.pre('save', function(next){
    if(this.isModified('name')){
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

subcategorySchema.pre('findOneAndUpdate', function(next){
    const update = this.getUpdate();
    if(update.name){
        update.slug = update.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

// Validar categoría activa en save
subcategorySchema.pre('save', async function(next) {
    if (this.isModified('category')) {
        const Category = mongoose.model('Category');
        const category = await Category.findById(this.category);

        if (!category) {
            return next(new Error('La categoría no existe'));
        }
        if (!category.isActive) {
            return next(new Error('La categoría no está activa'));
        }
    }
    next();
});

// Virtual para contar productos asociados
subcategorySchema.virtual('productCount', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'subcategory', // <-- asegúrate que coincida con tu modelo Product
    count: true,
});

// Métodos estáticos
subcategorySchema.statics.findActiveByCategory = function(categoryId){
    return this.find({ category: categoryId, isActive: true })
        .populate('category', 'name slug')
        .sort({ sortOrder: 1, name: 1 });
};

subcategorySchema.statics.findAllActive = function(){
    return this.find({ isActive: true })
        .populate('category', 'name slug')
        .sort({ sortOrder: 1, name: 1 });
};

// Métodos de instancia
subcategorySchema.methods.canBeDeleted = async function(){
    const Product = mongoose.model('Product');
    const productsCount = await Product.countDocuments({ subcategory: this._id });
    return productsCount === 0;
};

subcategorySchema.methods.getFullPath = async function(){
    await this.populate('category', 'name');
    return `${this.category.name} > ${this.name}`;
};

// Índices recomendados
subcategorySchema.index({ category: 1, name: 1 });
subcategorySchema.index({ isActive: 1 });
subcategorySchema.index({ sortOrder: 1 });
subcategorySchema.index({ createdBy: 1 });

module.exports = mongoose.model('Subcategory', subcategorySchema);
