/*
    path: api/post

*/

const { Router } = require('express');
const { validarJWT, isAdmin } = require('../middlewares/validar-jwt');

const { getRoles, getUserRoles, updateUserRole } = require('../controllers/role');
const router = Router();

router.get('/getrole', validarJWT, getRoles);

router.get('/getuserrole', validarJWT, getUserRoles);

router.put('/updateUserRole/:id', validarJWT, isAdmin, updateUserRole);



module.exports = router;