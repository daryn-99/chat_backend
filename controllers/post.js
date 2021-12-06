const { response } = require('express');
const Post = require('../models/post');
const Usuario = require('../models/usuario');
const path = require('path');

const express = require("express");
const router = express.Router();
const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '..', 'storage', 'posts')
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${req.params.id}-${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 6,
    // },
});

const stories = async (req, res = response) => {
    // try {
    //     const userStories = await Post.find({})
    //     .populate("user", "nombre apellido imgUrl")
    //     res.status(201).json(userStories);
    // } catch (error) {
    //     console.log(error)
    // }

    Post.find({}, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: [] });
        else return res.json({ data: result });
    }).populate("user", "nombre apellido imgUrl").sort({ createdAt: 'desc' });
}

const blogPost = async (req, res = response) => {

    try {
        const post = await Post(
            //console.log(req.file),
            {
                user: req.uid,
                title: req.body.title,
                //coverImage: req.file.path
            }
        );
        // await post.save();
        // res.json({
        //     ok: true,
        //     post
        // });
        post.save().then((result) => {
            return res.status(200).json({ok: true, data: result["_id"] });
        });
        console.log(post)

        // res.json({
        //     ok: true,
        //     post
        // });
    } catch (error) {
        console.log(error);
        res.status(500).status({
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

// router.route('/updateImg/:id').patch(validarJWT, upload.single('coverImage'), (req, res) => {
const updatePostImg = async (req, res = response) => {
    const remove = path.join(__dirname, '..', 'storage')
    const relPath = req.file.path.replace(remove, '').replace(/\\/g, '/')
    const imgUrl = relPath;
    Post.findOneAndUpdate({ _id: req.params.id },
        {
            $set: {
                coverImage: relPath,
            },
        }, { new: true },
        (err, result) => {
            if (err) return res.json(err);
            return res.json({
                ok: true,
                result
            })
        }
    );
    // {
    //     if (err) return res.status(500).send(err);
    //     const response = {
    //         message: "image added successfully updated",
    //         data: post,
    //     };
    //     return res.status(200).send(response);
    // });
}

const getPost = async (req, res = response) => {

    Post.findOne({ user: req.uid }, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: [] });
        else return res.json({ data: result });
    }).sort({ createdAt: 'desc' });

}

const ownPost = async (req, res = response) => {

    const miId = req.uid;

    Post.find({ $or: [{ user: miId }] }, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: [] });
        else return res.json({ data: result });
    }).sort({ createdAt: 'desc' });
}


const otherPost = async (req, res = response) => {

    const miId = req.uid;

    Post.find({}, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: [] });
        else return res.json({ data: result });
    }).populate("user", "nombre apellido imgUrl").sort({ createdAt: 'desc' });

}

const deletePostByid = async (req, res = response) => {
    const miId = req.uid
    //const p = req.id;

    Post.findByIdAndDelete({ _id: req.params.id },
        (err, result) => {
            if (err) return res.json(err);
            else if (result) {
                console.log(result);
                return res.json("Post Eliminado");
            }
            return res.json("Error");
        }
    )


    // res.json({
    //     ok: true,
    //     deletedPost
    // })

    //Codigo para eliminar post
    // Post.findOneAndDelete(
    //     {
    //         $and: [{ user: miId }, { _id: req.params.id }],
    //     },
    //     (err, result) => {
    //         if (err) return res.json(err);
    //         else if (result) {
    //             console.log(result);
    //             return res.json("Post Eliminado");
    //         }
    //         return res.json("No puedes eliminar un post de otro usuario");
    //     }
    // );
}



module.exports = {
    blogPost,
    ownPost,
    updatePostImg,
    getPost,
    otherPost,
    deletePostByid,
    upload,
    stories
}