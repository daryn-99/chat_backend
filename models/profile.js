const { Schema, model } = require('mongoose');
const { UsuarioSchema } = require('./usuario')
//TODO:Terminar
const ProfileSchema = Schema({

    username: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    about: String,
    imgUrl: {
        type: String,
        default: ""
    },
},
    {
        timestamps: true,
    }
);

ProfileSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
})

module.exports = model('Profile', ProfileSchema);