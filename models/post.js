const { Schema, model } = require('mongoose');


const PostSchema = Schema({
    user: {
        type: Schema .Types.ObjectId,
        ref: 'Usuario',
        //required: true
    },
    otheruser: {
        type: Schema .Types.ObjectId,
        ref: 'Usuario',
    },
    title: { 
        type: String,
    },
    caption: { 
        type: String,
    },
    coverImage: {
        type: String,
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