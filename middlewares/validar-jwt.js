const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const Role = require('../models/role');

const validarJWT = ( req, res, next ) => {

    // Leer token
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify( token, 'haJSHdjksh!!1i27@askjdhm2nasa21' );
        req.uid = uid;
        
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

}

const isAdmin = async (req, res, next) => {
    const user = await usuario.findById(req.uid)
    const roles = await Role.find({_id: {$in: user.role}})

    for (let i = 0; i < roles.length; i++){
        if(roles[i].name === "administrador"){
            next();
            return console.log("Accion realizada con exito"); //res.status(202).json({message: 'Accion realizada con exito'});
        }
    }

    return res.status(403).json({message: 'Requiere permisos de administrador'});
}


const isGerente = async (req, res, next) => {
    const user = await usuario.findById(req.uid)
    const roles = await Role.find({_id: {$in: user.role}})

    for (let i = 0; i < roles.length; i++){
        if(roles[i].name === "gerente"){
            next();
            return res.status(202).json({message: 'Accion realizada con exito'});
        }
    }

    return res.status(403).json({message: 'Requiere permisos de gerente'});
}

const isEmpleado = (req, res, next) => {
    
}

module.exports = {
    validarJWT,
    isAdmin,
    isGerente,
    isEmpleado
}


