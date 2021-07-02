const { response } = require('express');
const Post = require('../models/post');
const Usuario = require('../models/usuario');
const path = require('path');

const blogPost = async (req, res = response) => {

    const post = await Post(
        {
            user: req.uid,
            title: req.body.title,
            caption: req.body.caption
        }
    )
    await post.save();

    res.json({
        ok: true,
        post
    });
}


const addPostImg = async (req, res = response) => {

    // Post.findByIdAndUpdate({
    //     username: req.params._id
    // },
    // {
    //     $set: {
    //         coverImage: req.file.path,
    //     },
    // },
    // {new: true },
    // (err, result) => {
    //     if(err) return res.json(err);
    //     return res.json(result);
    // })

    const imgPost = await Post.findByIdAndUpdate(req.params.uid, req.body)
    console.log(req.file)
    if (req.file) {
        imgPost.coverImage = req.file.path

    }
    res.json({
        ok: true,
        imgPost,
    })
}

const getPost = async (req, res = response) => {
    
    Post.find({}, (err, docs) => {
        res.send({docs})
    })
    
}

const ownPost = async (req, res = response) => {
    const usuario = Usuario();
    const post = await Post.find( req.params.uid)

res.json({
    ok: true,
    post,
    usuario

})
}

module.exports = {
    blogPost,
    addPostImg,
    ownPost,
    getPost
}