/*
    path: api/homepost

*/

const {Router} = require('express');
const { validarJWT, isAdmin } = require('../middlewares/validar-jwt');
const post = require('../models/post');
const router = Router();

router.post()

router.post('/homepost', [
    check('caption','La descripcion es obligatoria', validarJWT, ).not().isEmpty(),
], post );


module.exports = router;