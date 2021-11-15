const { response, Router } = require('express');
const mongoose = require('mongoose')

const Usuario = require('../models/usuario');
const Role = require('../models/role');
// const imgUrl = require('../libs/storage');
const path = require('path');
const usuarioService = require('../controllers/usuario_service');

require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { reset } = require('nodemon');
const { generarJWT } = require('../helpers/jwt');

const getOneUsuario = async (req, res = response) => {
    Usuario.findOne({ data: req.uid }, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: ['A'] });
        else return res.json({ data: result });
    }).sort({ createdAt: 'desc' })
}

const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario.find({ _id: { $ne: req.uid } }).sort('-online').skip(desde).limit(Usuario).populate("role", "name")

    res.json({
        ok: true,
        usuarios,
        desde
    })
}

const getLastUsers = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const lastusers = await Usuario.find({}).sort('createdAt').skip(desde).limit(Usuario)

    res.json({
        ok: true,
        lastusers,
        desde
    })
}

const getUserRole = async (req, res = response) => {
    const rolesuser = await Usuario.find({ user: req.uid }).populate('role', 'name');

    res.json({
        ok: true,
        rolesuser
    })
}

const getUsersByGroups = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const lastusers = await Usuario.find({ online: true }).sort('updatedAt')

    res.json({
        ok: true,
        lastusers,
        desde
    })
}



const getAllUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario.find({ _id: { $ne: req.uid } }).sort('-online').skip(desde).limit(Usuario).populate("role", "name")

    res.json({
        ok: true,
        usuarios,
        desde
    })
}


const getUsuarioById = async (req, res = response) => {

    const usuario = await Usuario.findOne(req.params.area, req.body)
    //res.status(200).json(usuario) falta validacion

    res.json({
        ok: true,
        usuario
    })
}

const parseId = (id) => {
    return mongoose.Types.ObjectId(id)
}

const updateUserByid = async (req, res = response) => {

    const { id } = req.params
    const body = req.body
    Usuario.updateOne({ _id: id },
        body,
        (err, docs) => {
            res.send({
                items: docs
            })
        })



    // const updatedUser = await Usuario.findAndUpdate(req.params.userId, req.body)

    // // if(req.file){
    // //     const {filename} = req.file
    // //     updatedUser.setImgUrl(filename)
    // // }


    // res.json({
    //     ok: true,
    //     updatedUser
    // })
    // const {id} = req.params;
    // let usuario = {};
    // await Usuario.findOne({ id }, (err, result) => {
    //     if (err) {
    //         usuario = {};
    //     }
    //     if (result != null) {
    //         usuario = result;
    //     }
    // });
    // Usuario.updateOne(
    //     { _id: id },
    //     {
    //         $set: 
    //         {
    //             username: req.body.username ? req.body.username : usuario.username,
    //             nombre: req.body.nombre ? req.body.nombre : usuario.nombre,
    //             apellido: req.body.apellido ? req.body.apellido : usuario.apellido,
    //             numerotel: req.body.numerotel ? req.body.numerotel : usuario.numerotel,
    //             birth: req.body.birth ? req.body.birth : usuario.birth,
    //             cargo: req.body.cargo ? req.body.cargo : usuario.cargo,
    //             area: req.body.area ? req.body.area : usuario.area,
    //             email: req.body.email ? req.body.email : usuario.email,

    //         },
    //     },
    //     { new: true },
    //     (err, result) => {
    //         if (err) return res.json({ err: err });
    //         if (result == null) return res.json({ data: [] });
    //         else return res.json({ data: result });
    //     }
    // );
}

// const modificarUsuario = async(req, res) => {
//     res.json({
//         Usuario: await clienteService.modificarcliente(req.body)
//     })
// }

const deleteUserByid = async (req, res = response) => {
    const deleteUser = await Usuario.findByIdAndDelete(req.params.userId)

    res.json({
        ok: true,
        deleteUser
    })
}

const passwordUpdate = async (req, res = response) => {


    const { email } = req.body;
    const { password } = req.body;

    try {
        
        const existeEmail = await Usuario.findOne({ email });
        console.log(email)
        if (!existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no está registrado'
            });
        }
        await Usuario.findOneAndUpdate({ email },
            {
                $set:
                    { password: req.body.password }
            },
            { new: true },
            (err, result) => {
                if (err) return res.json(err);
                return res.json(result);
            }
        );
        console.log("Enviado")

        // if(req.file){
        //     const {filename} = req.file
        //     updatedUser.setImgUrl(filename)
        // }

        // res.json({
        //     ok: true,
        //     updatedPass
        // })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const modificarUsuario = async (req, res) => {
    res.json({
        usuario: await usuarioService.modificarUsuario(req.body)
    })
}

const emailForgotPassword =
    async (req, res = response) => {
        //try {
            const { email } = req.body;
            
            if (email == '') {
                res.status(204).send({
                    msg: 'El email es requerido'
                })
            }

            // try {
            const user = await Usuario.findOne({ email });
            //console.log(user.email);
            //user.email
            
            if ( !user ) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Email no encontrado'
                });
                
            }

            if (!user) {
                return res.status(206).json({
                    ok: false,
                    msg: 'El correo no está registrado'
                });
            }

            //const token = await generarJWT( user );

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'puertosammir@gmail.com',
                    pass: 'dadxrawtylnldkxv'
                    // user: `${process.env.EMAIL_ADDRESS}`,
                    // pass: `${process.env.EMAIL_PASSWORD}`,
                }
            });

            //const emailPort = process.env.PORT || 3000;
            //console.log(user);
            const mailOptions = {
                from: 'puertosammir@gmail.com',
                to: `${user.email}`,
                subject: 'Enlace para recuperar tu contraseña',
                text: `https://reconet.recoroatan.com/loginvista.html`
            };



            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Ha ocurrido un error:', err);
                } else {
                    console.log('Respuesta: ' + info.response);
                    res.status(200).json('El mail de recuperación ha sido enviado');
                }
            })

        // } catch (error) {
        //     return error
        // }



        // } catch (error) {
        //     res.status(500).send({
        //         msg: 'Ha ocurrido un error',
        //         error
        //     })
        // }
    }


let regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$1%*?&#]{8,16}$/;

const resetPassword =
    async (req, res = response) => {
        if (!regExPassword.test(req.body.password)) {
            res.send({
                msg: 'La contraseña debe de contener por lo menos: Entre 8 y 16 cáracteres, 1 numero, 1 letra minuscula, 1 letra mayuscula y un caracter especial'
            });
            return;
        }

        try {
            req.body.password = await bcrypt.hash(req.body.password, 10)
            const resetpassword = await Usuario.updateOne(req.body, {
                where: {
                    user: req.params.user, tokenresetPassword: req.params.tokenresetPassword
                }
            });
            res.status(201).send({
                msg: 'Contraseña actualizada con éxito'
            })
        } catch (err) {
            res.status(500).send({
                msg: 'Error',
                err
            })
        }
    }

const updateImg = async (req, res = response) => {
    const remove = path.join(__dirname, '..', 'storage')
    const relPath = req.file.path.replace(remove, '').replace(/\\/g, '/')

    Usuario.findOneAndUpdate(

        { user: req.uid },
        {
            $set: {
                imgUrl: relPath,
            },
        },
        { new: true },
        (err, result) => {
            if (err) return res.json(err);
            return res.json(result);
        }
    );
}

const updateusuarioUser = async (req, res = response) => {
    const remove = path.join(__dirname, '..', 'storage')
    const relPath = req.file.path.replace(remove, '').replace(/\\/g, '/')
    const imgUrl = relPath;
    Usuario.findOneAndUpdate(

        { user: req.params.uid },
        {
            $set: {
                imgUrl: relPath,
            },
        },
        { new: true },
        (err, result) => {
            if (err) return res.json(err);
            return res.json(result);
        }
    );
}


const updateDescr = async (req, res = response) => {
    const { id } = req.params
    const body = req.body
    Usuario.updateOne({ _id: id },
        body,
        (err, docs) => {
            res.send({
                items: docs
            })
        })
    // let usuario = {};
    // await Usuario.findOne({ _id: req.uid }, (err, result) => {
    //     if (err) {
    //         usuario = {};
    //     }
    //     if (result != null) {
    //         usuario = result;
    //     }
    // });
    // Usuario.findOneAndUpdate(
    //     { _id: req.uid },
    //     {
    //         $set: {
    //             descripcion: req.body.descripcion ? req.body.descripcion : usuario.descripcion,
    //             nombre: req.body.nombre ? req.body.nombre : usuario.nombre,
    //             cargo: req.body.cargo ? req.body.cargo : usuario.cargo,
    //             area: req.body.area ? req.body.area : usuario.area,
    //             birth: req.body.birth ? req.body.birth : usuario.birth,
    //         },
    //     },
    //     { new: true },
    //     (err, result) => {
    //         if (err) return res.json({ err: err });
    //         if (result == null) return res.json({ data: [] });
    //         else return res.json({ data: result });
    //     }
    // );
}








module.exports = {
    getUsuarios,
    getAllUsuarios,
    getUsuarioById,
    updateUserByid,
    deleteUserByid,
    getLastUsers,
    getUsersByGroups,
    getUserRole,
    passwordUpdate,
    emailForgotPassword,
    resetPassword,
    updateImg,
    getOneUsuario,
    modificarUsuario,
    updateusuarioUser,
    updateDescr
}
