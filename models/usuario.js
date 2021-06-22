const { Schema, model } = require('mongoose');
const { roleSchema } = require('./role');
const {config} = require('../database/config');



const UsuarioSchema = Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true
    },//TODO:Validar que el numero sea unico
    numerotel: {
            type: String,
            required: true,
            unique: true
    },
    birth: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    online: {
        type: Boolean,
        default: false
    },
    role: [{
        ref: 'Role',
        type: Schema.Types.ObjectId
    }],
    imgUrl: {
        type: String,
        default: ''
    }
    //TODO: Agregar fecha de nacimiento, area, cargo, fecha de creacion(Automatica), imagen de perfil(Estipular una por defecto)(Estipular limite de espacio ejemplo: 5mb).
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

UsuarioSchema.methods.setImgUrl = function setImgUrl () {
    const { host, port } = configs
    this.imgUrl = `${host}:${port}/public/${filename}`
}


module.exports = model('Usuario', UsuarioSchema );