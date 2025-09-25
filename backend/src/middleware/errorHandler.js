const errorHandler = (err, req, res, next) =>{
    console.error('Error Stack', err.stack);

    //Error de validacion de mongoose
    if(err.name === 'validateError'){
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success :false,
            message:'Error de validacion',
            errors
        })
    }
    // error de duplicado
    if(err.code === 11000){
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} ya existe en el sistema`,
        });
    }

    //Error de cast ObjectId
    if(err.name == 'CastError'){
        return res.status(400).json({
            message:false,
            message:'ID invalido'
        });
    }

    //Error JWT
    if(err.name === 'jsonWebTokenError'){
        return res.status(401).json({
            success:false,
            message: 'Token invalido'
        });
    }

    if(err.name === 'TokenExpiredError'){
        return res.status(401).json({
            success:false,
            message:'Token expirado'
        });
    }
    res.status(err.statusCode || 500).json({
        success:false,
        message: err.message || 'Error interno del servidor',
    });
}

//Middleware para manejar rutas no encontradas
const noFound = (req,res,next) =>{
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    res.status(404);
    next(error);

};

//middleware para validar el ObjectId
const validateObjectId = (paramName = 'id') =>{
    return(req,res,next) =>{
        const mongoose = require('mongoose');
        const id = req.params[paramName];
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:'ID invalido'
            });
        }
        next();
    };
};
//Middleware para capturar errores asincronicos
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


module.exports = {
    errorHandler,
    noFound,
    validateObjectId,
    asyncHandler
};