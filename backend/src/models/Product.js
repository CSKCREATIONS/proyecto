const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'El nombre de la subcategoria es requerido'],
        trim:true,
        minlength:[2,'El nombre de la subcategoria debe contener al menos 2 caracteres'],
        maxlength:[100,'El nombre de la subcategoria no puede exceder los 100 caracteres'],
    },
    description:{
        type: String,
        trim: true,
        maxlength:[1000,'La descripción no puede exceder los 1000 caracteres'],
    },
    shortDescription:{
        type: String,
        trim: true,
        maxlength:[250,'La descripción no puede exceder los 250 caracteres'],
    },
    slug:{
        type: String,
        unique: true,
        lowercase: true,
    },
    sku:{
        type:String,
        required:[true,'El SKU es requerido'],
        unique:true,
        uppercase:true,
        minlength:[3,'El SKU debe contener al menos 3 caracteres'],
        maxlength:[50,'El SKU no puede exceder los 50 caracteres'],
    },
    category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            require:[true,'La categoria es requerida'],
            validate:{
                validator: async function (categoryId) {
                    const Category = mongoose.model('Category');
                    const category = await Category.findById(categoryId);
                    return category && category.isActive;
            },
            message: 'La categoria debe existir y estar activa',
        }
        },
    subcategory:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subcategory',
            require:[true,'La subcategoria es requerida'],
            validate:{
                validator: async function (SubcategoryId) {
                    const Subcategory = mongoose.model('Subcategory');
                    const subcategory = await Subcategory.findById(SubcategoryId);
                    return Subcategory && Subcategory.isActive;
            },
            message: 'La subcategoria debe existir y estar activa',
        }
        },
    price:{
        type: Number,
        required:[true,'El precio es requerido'],
        min:[0,'El precio no puede ser negativo'],
        validate:{
            validator: function(value){
                return value >=0;
            },

            message: 'El precio no puede ser negativo',
        }
    },
    comparePrice:{
        type:Number,
        min:[0,'El precio de comparación no puede ser negativo'],
        validate:{
            validator: function(value){
                if (value !== undefined && value !== null)
                    return true;
                    return Number.isFinite(value) && value >= 0;
                
            },
            message: 'El precio de comparación debe ser un número válido y no negativo',
            
        }
    

    }, 
    const:{
        type:Number,
        min:[0,'El costo no puede ser negativo'],
        validate:{
            validator: function(value){
                if(value !== null || value === undefined)
                    return true;
                    return Number.isFinite(value) && value >= 0;
                },
                message: 'El costo debe ser un número válido y no negativo',
            }
        },
        stock:{
            quantity:{
                type:Number,
                default:0,
                min:[0,'La cantidad en stock no puede ser negativa'],

            },
            minstock:{
                type:Number,
                default:0,
                min:[0,'La cantidad mínima en stock no puede ser negativa'],
            },
            trackStock:{
                type:Boolean,
                default:true,        
            }
        },
        dimensions:{
            weigth:{
                type:Number,
                min:[0,'La altura no puede ser negativa'],
            },
            length:{
                type:Number,
                min:[0,'La longitud no puede ser negativa'],
            },
            width:{
                type:Number,
                min:[0,'El ancho no puede ser negativa'],
            },
            images:[{
                url:{
                    type:String,
                    required:true,
                    trim:true
                },
                alt:{
                    type:String,
                    trim:true,
                    maxlength:[100,'El texto alternativo no puede exceder los 200 caracteres']
                },
                isPrimary:{
                    type:Boolean,
                    default:false

                },
            }],
               
        },
        createdBy:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'User',
                require:true
        },
        updatedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        tags:[{
                    type:String,
                    trim:true,
                    lowercase:true,
                }],
                isActive:{
                    type:Boolean,
                    default:true
                },
                isFeactured:{
                    type:Boolean,
                    default:false
                },
                isDigital:{
                    type:Boolean,
                    default:false
                },
                sortOrder:{
                    type:Number,
                    trim:true,
                    maxlength:[70,'El titulo no puede exceder los 70 caracteres']
                },
                seoDescription:{
                    type:String,
                    trim:true,
                    maxLength:[160,'La descripción SEO no puede exceder los 160 caracteres']
                },
        },{
            timestamps:true,
});

productSchema.pre('save', function(next){
    if(this.isModified('name')){
        this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Reemplaza caracteres no alfanuméricos por guiones
        .replace(/^-+|-+$/g, ''); // Elimina guiones al principio y al final
    }
    next();
});

productSchema.pre('findOneAndUpdate', function(next){
    const update = this.getUpdate();
    if(update.name){
        update.slug = update.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Reemplaza caracteres no alfanuméricos por guiones
        .replace(/^-+|-+$/g, ''); // Elimina guiones al principio y al final
    }
    next();
});

productSchema.pre('save', async function(next) {
    if (this.isModified ('category') || this.isModified('subcategory')) {
        const Subcategory = mongoose.model('Subcategory');
        const subcategory = await Subcategory.findById(this.subcategory);

        if (!subcategory){
            return next(new Error('La subcategoría debe existe'));
        }

        if (subcategory.category.toString() !== this.category.toString()) {
            return next(new Error('La subcategoría debe pertenecer a la categoría seleccionada'));
        }

    }
    next();
});

productSchema.virtual('profitMagin').get(function(){
    if (this.Price && this.cost) {
        return ((this.price - this.cost) / this.price) * 100;
    }
    return 0;  
});

productSchema.virtual('stockStatus').get(function() {
    if (this.stock.trackStock) return false; 
    return this.stock.quantity <= 0;
});

productSchema.virtual('primaryImage').get(function() {
    return this.images.find(image => image.isPrimary) || this.images[0] || null;
});

productSchema.static.findActive = function(){
    return this.find({ isActive: true })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort({ sortOrder: -1, name: 1});
};

productSchema.statics.findByCategory = function(categoryId){
    return this.find({
        category: categoryId,
        isActive: true
    })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort({ sortOrder: -1, name: 1 });
}

productSchema.statics.findBySubcategory = function(subcategoryId){
    return this.find({
        subcategory: subcategoryId,
        isActive: true
    })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort({ sortOrder: -1, name: 1 });
}

productSchema.statics.findFeature = function(){
    return this.find({
        isFeactured: true,
        isActive: true
    })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort({ sortOrder: -1, name: 1 });
};

productSchema.methods.getFullPath = async function () {
    await this.populate([
        {path: 'category', select: 'name'},
        {path: 'subcategory', select: 'name'}
    ]);

    return `${this.category.name} > ${this.subcategory.name} > ${this.name}`;
};

productSchema.methods.updateStock = async function(quantity) {
    if (this.stock.trackStock) {
        this.stock.quantity += quantity;
        if (this.stock.quantity < 0) {
            this.stock.quantity = 0;
        }
    }
    return this.save();
};

productSchema.index({category: 1})
productSchema.index({subcategory: 1});
productSchema.index({isActive: 1});
productSchema.index({isFeactured: 1});
productSchema.index({price: 1});
productSchema.index({'stock.quantity': 1});
productSchema.index({sortOrder: 1});
productSchema.index({createdBy:1});
productSchema.index({tasg:1});
productSchema.index({updatedBy:1});


productSchema.index({
    name: 'text',
    description: 'text',
    shortDescription: 'text',
    tags: 'text',
});

module.exports = mongoose.model('Product', productSchema);
