const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre de la categoría es requerido'],
            trim: true,
            unique: true,
            minlength: [2, 'El nombre de la categoría debe contener al menos 2 caracteres'],
            maxlength: [100, 'El nombre de la categoría no puede exceder los 100 caracteres']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        icon: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            trim: true,
            match: [/^#([0-9A-F]{6}){1,2}$/i, 'El color debe ser un código hexadecimal válido']
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

categorySchema.pre('save', function(next){
    if(this.isModified('name')){
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') 
            .replace(/^-+|-+$/g, '');
    }
    next();
});

categorySchema.pre('findOneAndUpdate', function(next){
    const update = this.getUpdate();
    if(update.name){
        update.slug = update.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

categorySchema.virtual('productCount', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category',
    count: true
});

categorySchema.static.findActive = function(){
    return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
}

categorySchema.methods.canBeDeleted = async function(){
    const Subcategory = mongoose.model('Subcategory');
    const Product = mongoose.model('Product');

    const subcategoriesCount = await Subcategory.countDocuments({ category: this._id });
    const productsCount = await Product.countDocuments({ category: this._id });

    return subcategoriesCount === 0 && productsCount === 0;
};

categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
