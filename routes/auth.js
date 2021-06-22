/*
    path: api/login

*/
const { Router } = require('express');
const { check } = require('express-validator');
const multer = require('multer');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, isAdmin} = require('../middlewares/validar-jwt');
const upload = require('../libs/storage');

const router = Router();


router.post('/new', [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('apellido','El apellido es obligatorio').not().isEmpty(),
    check('numerotel','El numero de celular es obligatorio').isMobilePhone().not().isEmpty(),
    check('birth', 'La fecha de nacimiento es obligatoria').not().isEmpty().isDate(),
    check('cargo','El cargo es obligatorio').not().isEmpty(),
    check('area','El area es obligatoria').not().isEmpty(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email','El correo es obligatorio').isEmail().not().isEmpty(),
    validarJWT, isAdmin, upload.single('imgUrl'), validarCampos, 
], crearUsuario );

router.post('/', [
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email','El correo es obligatorio').isEmail(),
], login );


router.get('/renew', validarJWT, renewToken );


module.exports = router;
