/*
    path: api/post

*/

const { Router } = require('express');
const { validarJWT, isAdmin, isGerente, areBoth } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const { blogPost, ownPost, getPost, otherPost, deletePostByid, updatePostImg, stories } = require('../controllers/post');
const router = Router();
const postUploads = require('../middlewares/postStorage');
const { check } = require('express-validator');


router.post('/new',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    validarJWT, areBoth,
],  blogPost);

router.get('/getownpost', validarJWT, ownPost);

router.get('/get', validarJWT, getPost);

router.get('/getOtherPost', validarJWT, otherPost);

router.delete('/:id', validarJWT, isAdmin, deletePostByid);

router.patch('/updateImg/:id', validarJWT, areBoth, postUploads.single('coverImage'), updatePostImg);

router.get('/getStoryOther', validarJWT, stories);



module.exports = router;                                                                                                                                                                    