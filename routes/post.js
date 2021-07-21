/*
    path: api/post

*/

const { Router } = require('express');
const { validarJWT, isAdmin } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const { blogPost, addPostImg, ownPost, getPost, otherPost, deletePostByid } = require('../controllers/post');
const router = Router();
const upload = require('../middlewares/storage');
const postUploads = require('../middlewares/postStorage');
const { check } = require('express-validator');


router.post('/new',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('caption', 'El caption es obligatorio'), validarJWT, postUploads.single('coverImage'), isAdmin,
],  blogPost);

router.patch('/new/coverImage/:id', validarJWT, postUploads.single('coverImage'), addPostImg);

router.get('/getownpost', validarJWT, ownPost);

router.get('/get', validarJWT, getPost);

router.get('/getOtherPost', validarJWT, otherPost);

router.delete('/:id', validarJWT, isAdmin, deletePostByid);


module.exports = router;                                                                                                                                                                    