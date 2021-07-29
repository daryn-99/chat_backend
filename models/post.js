const { Schema, model } = require('mongoose');


const PostSchema = Schema({
    user: {
        type: Schema .Types.ObjectId,
        ref: 'Usuario',
        //required: true
    },
    title: { 
        type: String,
    },
    coverImage: {
        type: String,
        default: ''
    },
    like: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false,
    timestamps: true
})


module.exports = model('Post', PostSchema);