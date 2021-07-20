const { response } = require('express');
const Post = require('../models/post');
const Usuario = require('../models/usuario');
const path = require('path');

const blogPost = async (req, res = response) => {

    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
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

    // const imgPost = await Post.findByIdAndUpdate({ user: req.uid }, {
    //     $set: {
    //         coverImage: req.file.path,
    //     },
    // },
    // { new: true },
    // (err, result) => {
    //     if (err) return res.json(err);
    //     return res.json(result);
    // });


    try{
        const imgPost = new Post({
            user: req.uid,
            coverImage: req.file
        });
        await imgPost.save();
        res.status(201).send('File Uploaded Successfully');
    }catch(error) {
        res.status(400).send(error.message);
    }
        
}

const getPost = async (req, res = response) => {

    Post.findOne({ user: req.uid }, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: [] });
        else return res.json({ data: result });
        }).sort({createdAt: 'desc'});

}

const ownPost = async (req, res = response) => {
    const usuario = Usuario();
    const post = await Post.find(req.params.uid)

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