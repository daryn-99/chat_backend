const { Schema, model } = require('mongoose');
const {UsuarioSchema} = require('./usuario')
//TODO:Terminar
const ProfileSchema = Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    about: String,
    img: {
        type: String,
        default:""
    }
    },
    {
        timestamps: true,
    }
);

module.exports = model('Profile', ProfileSchema );