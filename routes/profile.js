/*
    path: api/profile

*/

const { Router } = require('express');
const { validarJWT} = require('../middlewares/validar-jwt');
const {addProfile, updateProfileImg, getProfiles, getProfileById} = require('../controllers/profile');
const path = require('path');
const upload = require('../middlewares/storage');

const router = Router();

router.get('/checkprofiles', validarJWT, getProfiles );//TODO: Agregar permisos de Admin

router.post('/add', addProfile);

router.get('/getone/:id', validarJWT, getProfileById);

router.patch('/add/profileimg', validarJWT, upload.single('imgUrl'), updateProfileImg);

module.exports = router;