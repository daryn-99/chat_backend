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

        const { uid } = jwt.verify( token, process.env.JWT_KEY);
        req.uid = uid;
        
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

}


const validarJWTPass = ( req, res, next ) => {

    // Leer token
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT2_KEY );
        req.uid = uid;
        
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

}

const areBoth = async (req, res, next) => {
    const user = await usuario.findById(req.uid)
    const roles = await Role.find({_id: {$in: user.role}})

    for (let i = 0; i < roles.length; i++){
        if(roles[i].name === "administrador"){
            next();
            return console.log("Accion realizada con exito");
            //return res.status(202).json({message: 'Accion realizada con exito'});
        } else if(roles[i].name === "gerente"){
            next();
            return console.log("Accion realizada con exito");
            //return res.status(202).json({message: 'Accion realizada con exito'});
        }else {
            return res.status(401).json({message: 'Requiere permisos'});
        }
    }

    return res.status(403).json({message: 'Error al encontrar el rol'});
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
            return console.log("Accion realizada con exito"); //res.status(202).json({message: 'Accion realizada con exito'});
        }
    }

    return res.status(403).json({message: 'Requiere permisos de gerente'});
}





const isEmpleado = async (req, res, next) => {
    const user = await usuario.findById(req.uid)
    const roles = await Role.find({_id: {$in: user.role}})

    for (let i = 0; i < roles.length; i++){
        if(roles[i].name != "empleado"){
            next();
            return console.log("Accion realizada con exito"); //res.status(202).json({message: 'Accion realizada con exito'});
        }
        else{
            return res.status(403).json({message: 'Requiere permisos de administrador'});
        }
    
    }
}

module.exports = {
    validarJWT,
    isAdmin,
    isGerente,
    isEmpleado,
    validarJWTPass,
    areBoth
}


