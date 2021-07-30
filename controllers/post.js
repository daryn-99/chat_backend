const { response } = require('express');
const Post = require('../models/post');
const Usuario = require('../models/usuario');
const path = require('path');


const blogPost = async (req, res = response) => {

    try {
        const post = await Post(
            //console.log(req.file),
            {
                user: req.uid,
                title: req.body.title,
                // coverImage: req.file.path
            }
        );
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

    // const blogpost = Post({
    //     user: req.uid,
    //     title: req.body.title,
    //     caption: req.body.caption,
    // });
    // blogpost
    //     .save()
    //     .then((result) => {
    //         res.json({ data: result["_id"] });
    //     })
    //     .catch((err) => {
    //         console.log(err), res.json({ err: err });
    //     });

}


const updatePostImg = async (req, res = response) => {
    const remove = path.join(__dirname,'..','storage')
    const relPath = req.file.path.replace(remove,'').replace(/\\/g, '/')
    const imgUrl = relPath;
    Post.findOneAndUpdate({ user: req.uid }, 
        {
        $set: {
            coverImage: relPath
        },
    }, { new: true },
        (err, post) => {
            if (err) return res.status(500).send(err);
            const response = {
                message: "image added successfully updated",
                data: post,
            };
            return res.status(200).send(response);
        });
}

const getPost = async (req, res = response) => {

    Post.findOne({ user: req.uid }, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: [] });
        else return res.json({ data: result });
    }).sort({ createdAt: 'desc' });

}

const ownPost = async (req, res = response) => {
    // const usuario = Usuario();
    // const post = await Post.find(req.params.uid)

    // res.json({
    //     ok: true,
    //     post, 
    //     usuario

    // })
    const miId = req.uid;

    Post.find({ $or: [{ user: miId }] }, (err, result) => {
        if (err) return res.json(err);
        return res.json({ data: result });
    }).sort({ createdAt: 'desc' });
}


const otherPost = async (req, res = response) => {
    const miId = req.uid;
    const postDe = req.params.user;

    const last30 = await Post.find({
        $or: [{ user: miId, otheruser: postDe },
        { user: postDe, otheruser: miId }]
    })
        .sort({ createdAt: 'desc' });

    res.json({
        ok: true,
        posts: last30,
    });
    // const miId = req.uid;

    // Post.find({ user: { $ne: miId } }, (err, result) => {
    //     if (err) return res.json(err);
    //     return res.json({ data: result });
    // }).sort({ createdAt: 'desc' });

}

const deletePostByid = async (req, res = response) => {
    //Elimina los post de todos
    // const deletedPost = await Post.findByIdAndDelete(req.params.id)

    // res.json({
    //     ok: true,
    //     deletedPost
    // })
    const miId = req.uid

    Post.findOneAndDelete(
        {
            $and: [{ user: miId }, { _id: req.params.id }],
        },
        (err, result) => {
            if (err) return res.json(err);
            else if (result) {
                console.log(result);
                return res.json("Post Eliminado");
            }
            return res.json("No puedes eliminar un post de otro usuario");
        }
    );
}



module.exports = {
    blogPost,
    ownPost,
    updatePostImg,
    getPost,
    otherPost,
    deletePostByid
}