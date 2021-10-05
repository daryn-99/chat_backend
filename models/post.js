const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

const PostSchema = Schema({
    user: {
        type: ObjectId,
        ref: 'Usuario',
        //required: true
    },
    perfil: {
        type: ObjectId,
        ref: 'Profile'
    },
    title: { 
        type: String,
    },
    coverImage: {
        type: String,
        default: ''
    },
    comment: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false,
    timestamps: true
})


module.exports = model('Post', PostSchema);