const { Schema, model } = require('mongoose');
const { roleSchema } = require('./role');
//const {config} = require('../database/config');



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
    },
    numerotel: {
            type: String,
            required: true,
            unique: true
    },//TODO:Validar que el numero sea unico
    birth: {
        type: String,
        
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
    },
    
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


module.exports = model('Usuario', UsuarioSchema );