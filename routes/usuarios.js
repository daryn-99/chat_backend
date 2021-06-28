/*
    path: api/usuarios

*/
const { Router } = require('express');
const { validarJWT, isAdmin, isGerente, isEmpleado } = require('../middlewares/validar-jwt');

const {getUsuarios, getAllUsuarios, getUsuarioById, updateUserByid, deleteUserByid} = require('../controllers/usuarios');


const router = Router();


router.get('/', validarJWT, getUsuarios );

router.get('/:userId', validarJWT, getAllUsuarios );

router.get('/:userId', validarJWT, getUsuarioById );

router.put('/:userId', validarJWT, isAdmin, updateUserByid);

router.delete('/:userId', [validarJWT, isAdmin], deleteUserByid);


//Ruta para guardar las imagenes en la base de datos
//router.patch()

module.exports = router;
