/*
    path: api/usuarios

*/
const { Router } = require('express');
const { validarJWT, isAdmin, isGerente, isEmpleado } = require('../middlewares/validar-jwt');

const {getUsuarios, getAllUsuarios, getUsuarioById, updateUserByid, deleteUserByid, getLastUsers, getUsersByGroups, getUserRole, passwordUpdate, 
        emailForgotPassword, resetPassword, updateImg, getOneUsuario, modificarUsuario, updateDescr, newPassword} = require('../controllers/usuarios');


const router = Router();

router.get('/a/', (req, res ) => {
    res.render('loginvista.html');
} );

router.get('/', validarJWT, getUsuarios );

router.get('/allusers', validarJWT, isAdmin, getAllUsuarios );

router.get('/:userId', validarJWT, getUsuarioById );

router.get('/roleuser', validarJWT, getUserRole );

router.get('/lastusers', validarJWT, getLastUsers );

router.get('/orderbygroups', validarJWT, getUsersByGroups )

router.put('/updateUser/:id', validarJWT, updateUserByid);

router.post('/passwordUpdate', passwordUpdate);

router.delete('/delete/:userId', validarJWT, isAdmin, deleteUserByid);

router.post('/forgotPassword', emailForgotPassword );

router.put('/resetPassword', resetPassword);

router.patch('/update', validarJWT, updateImg);

router.get('/getUsuario', validarJWT, getOneUsuario);

router.patch('/updateDes', validarJWT, updateDescr);

router.post('/newpasswordUpdate', validarJWT, newPassword);



module.exports = router;
