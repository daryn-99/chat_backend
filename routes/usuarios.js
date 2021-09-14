/*
    path: api/usuarios

*/
const { Router } = require('express');
const { validarJWT, isAdmin, isGerente, isEmpleado } = require('../middlewares/validar-jwt');

const {getUsuarios, getAllUsuarios, getUsuarioById, updateUserByid, deleteUserByid, getLastUsers, getUsersByGroups, getUserRole} = require('../controllers/usuarios');


const router = Router();


router.get('/', validarJWT, getUsuarios );

router.get('/allusers', validarJWT, getAllUsuarios );

router.get('/:userId', validarJWT, getUsuarioById );

router.get('/roleuser', validarJWT, getUserRole );

router.get('/lastusers', validarJWT, getLastUsers );

router.get('/orderbygroups', validarJWT, getUsersByGroups )

router.put('/:userId', validarJWT, isAdmin, updateUserByid);

router.delete('/:userId', [validarJWT, isAdmin], deleteUserByid);


//Ruta para guardar las imagenes en la base de datos
//router.patch()

module.exports = router;
