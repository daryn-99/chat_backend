/*
    path: api/profile

*/

const { Router } = require('express');
const { validarJWT} = require('../middlewares/validar-jwt');
const {addProfile, updateProfileImg, getProfiles, getProfileById, getownProfile, getProfile, update} = require('../controllers/profile');
const path = require('path');
const upload = require('../middlewares/storage');

const router = Router();

router.get('/checkprofiles', validarJWT, getProfiles );//TODO: Agregar permisos de Admin

router.get('/get', validarJWT, getProfile );

router.post('/add', validarJWT, upload.single('imgUrl'), addProfile);

router.get('/getone/:id', validarJWT, getProfileById);

router.get('/getownprofile', validarJWT, getownProfile);

router.patch('/add/profileimg', validarJWT, upload.single('imgUrl'), updateProfileImg);

router.patch('/update', validarJWT, update );


module.exports = router;