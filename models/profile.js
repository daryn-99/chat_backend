const { Schema, model } = require('mongoose');
const { UsuarioSchema } = require('./usuario');
const {ObjectId} = Schema.Types;
//TODO:Terminar
const ProfileSchema = Schema({

    user: {
        type: ObjectId,
        ref: 'Usuario',
    },
    about: {
        type: String,
        default: 'Agrega una descripción'
    },
    imgUrl: {
        type: String,
        default: ''
    },
},
    {
        timestamps: true,
    }
);

// ProfileSchema.method('toJSON', function() {
//     const { __v, _id, ...object } = this.toObject();
//     return object;
// })

module.exports = model('Profile', ProfileSchema);