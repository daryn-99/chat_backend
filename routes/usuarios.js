/*
    path: api/usuarios

*/
const { Router } = require('express');
const { validarJWT, isAdmin, isGerente, isEmpleado } = require('../middlewares/validar-jwt');

const {getUsuarios, getAllUsuarios, getUsuarioById, updateUserByid, deleteUserByid, getLastUsers, getUsersByGroups, getUserRole, passwordUpdate, 
        emailForgotPassword, resetPassword, updateImg, getOneUsuario, modificarUsuario, updateDescr} = require('../controllers/usuarios');


const router = Router();

router.get('/a/', (req, res ) => {
    res.render('loginvista.html');
} );

router.get('/', validarJWT, validarJWT, getUsuarios );

router.get('/allusers', validarJWT, getAllUsuarios );

router.get('/:userId', validarJWT, getUsuarioById );

router.get('/roleuser', validarJWT, getUserRole );

router.get('/lastusers', validarJWT, getLastUsers );

router.get('/orderbygroups', validarJWT, getUsersByGroups )

router.patch('/updateUser', validarJWT, updateUserByid);

router.post('/passwordUpdate', passwordUpdate);

router.delete('/delete/:userId', validarJWT, isAdmin, deleteUserByid);

router.post('/forgotPassword', emailForgotPassword );

router.put('/resetPassword', resetPassword);

router.patch('/update', validarJWT, updateImg);

router.get('/getUsuario', validarJWT, getOneUsuario);

router.put('/modificar/:id', validarJWT, updateUserByid);

router.patch('/updateDes', validarJWT, updateDescr);


module.exports = router;
