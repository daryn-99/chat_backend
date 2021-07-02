/*
    path: api/post

*/

const { Router } = require('express');
const { validarJWT, isAdmin } = require('../middlewares/validar-jwt');
const { blogPost, addPostImg, ownPost, getPost } = require('../controllers/post');
const router = Router();
const upload = require('../middlewares/storage');


router.post('/new', validarJWT, isAdmin, blogPost);

router.patch('/new/coverImage', validarJWT, upload.single('coverImage'), addPostImg);

router.get('/getownpost', validarJWT, ownPost);

router.get('/get', validarJWT, getPost);

module.exports = router;