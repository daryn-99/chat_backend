/*
    path: api/post

*/

const { Router } = require('express');
const { validarJWT, isAdmin } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const { blogPost, addPostImg, ownPost, getPost } = require('../controllers/post');
const router = Router();
const upload = require('../middlewares/storage');
const { check } = require('express-validator');


router.post('/new',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('caption', 'El caption es obligatorio'), validarJWT, isAdmin,
],  blogPost);

router.post('/new/coverImage', validarJWT, upload.single('coverImage'), addPostImg);

router.get('/getownpost', validarJWT, ownPost);

router.get('/get', validarJWT, getPost);

module.exports = router;