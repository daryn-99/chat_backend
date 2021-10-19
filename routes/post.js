/*
    path: api/post

*/

const { Router } = require('express');
const { validarJWT, isAdmin, isGerente } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const { blogPost, ownPost, getPost, otherPost, deletePostByid, updatePostImg, upload, stories } = require('../controllers/post');
const router = Router();
const postUploads = require('../middlewares/postStorage');
const { check } = require('express-validator');


router.post('/new',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    validarJWT, isAdmin || isGerente,
],  blogPost);

router.get('/getownpost', validarJWT, ownPost);

router.get('/get', validarJWT, getPost);

router.get('/getOtherPost', validarJWT, otherPost);

router.delete('/:id', validarJWT, isAdmin || isGerente, deletePostByid);

router.patch('/updateImg/:id', validarJWT, isAdmin || isGerente, upload.single('coverImage'), updatePostImg);

router.get('/getStoryOther', validarJWT, stories);



module.exports = router;                                                                                                                                                                    