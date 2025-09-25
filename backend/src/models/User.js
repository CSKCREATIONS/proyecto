const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'El nombre de usuario es requerido'],
        unique:true,
        trim:true,
        minlength:[3,'El nombre de usuario debe contener al menos 3 caracteres'],
        maxlength:[50,'El nombre de usuario no puede exceder los 50 caracteres']
    },
    email:{
        type:String,
        required:[true,'El email es requerido'],
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Por favor ingrese un email válido']// validacion reguex permite verficar que el email es valido

    },
    password:{
        type:String,
        required:[true,'La contraseña es requerida'],
        minlength:[6,'La contraseña debe contener al menos 6 caracteres'],
    },
    firstName:{
        type:String,
        trim:true,
        maxlength:[50,'El nombre no puede exceder los 50 caracteres'],
        default: ''
    },
    lastName:{
        type:String,
        trim:true,
        maxlength:[50,'El apellido no puede exceder los 50 caracteres'],
        default: ''
    },
    role:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required:[true,'El rol es requerido']
    },
    isActive:{
        type:Boolean,
        default:true
    },
    phone:{
        type:String,
        trim:true,
        match:[/^\d{10}$/,'El número de teléfono debe contener 10 dígitos']
    },
    lastLogin:{
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Se refiere al usuario que lo creó
        default: null,
    },
},{
    timestamps:true
});


//encriptar la contraseña antes de guardar el usuario
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    } catch(error){
        next(error);
    }
});

//si van actualizar las contraseñas encriptadas
userSchema.pre('findOneAndUpdate',async function(next){
    const update = this.getUpdate();
    if(update.password) {
        try {
            const salt = await bcrypt.genSalt(12);
            update.password = await bcrypt.hash(update.password, salt);
        } catch (error) {
           return next(error);
        }
}

    next();

});

//metodos para comparar las contraseñas
userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        return await bcrypt.compare(candidatePassword, this.password);
    }catch(error){
        throw error;
    }
};
//Sobre escribir el metodo toJSON para no mostrar la contraseña
userSchema.methods.toJson = function(){
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`;
})

//Campo virtual para nombre que no se guarda en la base de datos
userSchema.index({role:1});
userSchema.index({isActive:1});

module.exports = mongoose.model('User', userSchema);