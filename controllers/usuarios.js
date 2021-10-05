const { response, Router } = require('express');
const Usuario = require('../models/usuario');
const Role = require('../models/role');
// const imgUrl = require('../libs/storage');
const path = require('path');

require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { reset } = require('nodemon');
const { generarJWT } = require('../helpers/jwt');



const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario.find({ _id: { $ne: req.uid } }).sort('-online').skip(desde).limit(Usuario)

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
    const rolesuser = await Role.find({})

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

    const allUsuarios = await Usuario.find({}).sort('area').skip(desde).limit(Usuario)

    // if (allUsuarios.length > 0) {
    //     res.send(allUsuarios);
    // } else {
    //     res.status(404).json({message: 'No hay registros de Usuarios'})
    // }


    res.json({
        ok: true,
        allUsuarios,
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

const updateUserByid = async (req, res = response) => {

    const updatedUser = await Usuario.findByIdAndUpdate(req.params.userId, req.body)

    // if(req.file){
    //     const {filename} = req.file
    //     updatedUser.setImgUrl(filename)
    // }

    res.json({
        ok: true,
        updatedUser
    })
}

const deleteUserByid = async (req, res = response) => {
    const deleteUser = await Usuario.findByIdAndDelete(req.params.userId)

    res.json({
        ok: true,
        deleteUser
    })
}

const passwordUpdate = async (req, res = response) => {


    const { email, password } = req.params;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (!existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no está registrado'
            });
        }
        const updatedPass = await Usuario.findOneAndUpdate({ email: req.params.email },
            {
                $set:
                    { password: req.body.password }
            },
            {new: true},
            (err, result) => {
                if(err) return res.json(err);
                return res.json(result);
            }
            );

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

const emailForgotPassword = 
    async (req, res = response ) => {

        //const { email} = req.params;

        if (req.body.email == '') {
            res.status(400).send({
                msg: 'El email es requerido'
            })
        }

    // try {
        const user = await Usuario.findOne({
            where: {
                email: req.body.email
            }
            })

        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no está registrado'
            });
        }

            const token = await generarJWT( user );

        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            secure: true,
            auth: {
                user: 'f3019b4e45c176',
                pass: 'd18ec6e302219d'
                // user: `${process.env.EMAIL_ADDRESS}`,
                // pass: `${process.env.EMAIL_PASSWORD}`,
            }
        });

        //const emailPort = process.env.PORT || 3000;

        const mailOptions = {
            from: '"Hello"<puertosammir@gmail.com>',
            to: `${user}`,
            subject: 'Enlace para recuperar tu contraseña',
            text: `http://localhost:3000/api/usuarios/resetpassword`
        };

        

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Ha ocurrido un error:', err);
            }else {
                console.log('Respuesta: '+ info.response);
                res.status(200).json('El mail de recuperación ha sido enviado');
            }
        })

    // } catch (error) {
    //     res.status(500).send({
    //         msg: 'Ha ocurrido un error',
    //         error
    //     })
    // }
}


let regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$1%*?&#]{8,16}$/;

const resetPassword = 
    async (req, res=response) => {
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
        const remove = path.join(__dirname,'..','storage')
        const relPath = req.file.path.replace(remove,'').replace(/\\/g, '/')
        
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
    updateImg
}
