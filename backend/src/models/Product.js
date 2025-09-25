const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'El nombre es obligatorio'],
        trim: true,
        unique:true
    },
    description:{
        type: String,
        required:[true,'la descripcion es obligatoria'],
        trim:true,
    },
    price:{
        type: Number,
        required:[true,'el precio es obligatorio'],
        min:[0,'El precio no puede ser negativo']
    },
    stock:{
        type: Number,
        required:[true,'El stock es requerido'],
        min:[0,'El stock no puede ser negativo'],
        default: 0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:[true, 'la categoria es requerida']
    },
    subcategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subcategory',
        required:[true,'la subcategoria es requerida']
    },
    images:[{
        type:String
    }],
    sku:{
        type: String,
        unique: true,
        sparse: true,
        uppercase: true,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean, 
        default: true
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor', 
        required: false
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps:true,
    versionKey:false
});

// Middleware para sincronizar estados
productSchema.pre('save', function(next) {
    // Sincronizar activo e isActive
    if (this.isModified('activo')) {
        this.isActive = this.activo;
    } else if (this.isModified('isActive')) {
        this.activo = this.isActive;
    }
    
    next();
});

// Método virtual para convertir stock a formato móvil cuando sea necesario
productSchema.virtual('stockForMobile').get(function() {
    return {
        quantity: this.stock || 0,
        minStock: 0,
        trackStock: true
    };
});

productSchema.post('save', function(error, doc, next){
    if(error.name === 'MongoServerError' && error.code === 11000){
        next(new Error('ya existe un producto con ese nombre'));
    } else{
        next(error);
    }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
