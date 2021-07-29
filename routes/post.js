/*
    path: api/post

*/

const { Router } = require('express');
const { validarJWT, isAdmin } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const { blogPost, addPostImg, ownPost, getPost, otherPost, deletePostByid, updatePostImg } = require('../controllers/post');
const router = Router();
const upload = require('../middlewares/storage');
const postUploads = require('../middlewares/postStorage');
const { check } = require('express-validator');


router.post('/new',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    validarJWT, postUploads.single('coverImage'), isAdmin,
],  blogPost);

router.get('/getownpost', validarJWT, ownPost);

router.get('/get', validarJWT, getPost);

router.get('/getOtherPost', validarJWT, otherPost);

router.delete('/:id', validarJWT, isAdmin, deletePostByid);

router.patch('/updateImg', validarJWT, postUploads.single('coverImage'), updatePostImg);



module.exports = router;                                                                                                                                                                    