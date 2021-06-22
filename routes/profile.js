const {Router} = require('express');
const { validarJWT, profileInput } = require('../middlewares/validar-jwt');
const profile = require('../models/profile');
const router = Router();

router.post()

router.post('/profile', [
    check('about','La descripcion es obligatoria', validarJWT, profileInput).not().isEmpty(),
], profile );


module.exports = router;