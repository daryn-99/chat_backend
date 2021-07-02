const { Schema, model } = require('mongoose');


const PostSchema = Schema({
    user: {
        type: Schema .Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    title: { 
        type: String,
    },
    caption: { 
        type: String,
    },
    coverImage: {
        type: String,
        default: "",
    },
    like: Number,
    comments: Number
}, {
    versionKey: false,
    timestamps: true
})


module.exports = model('Post', PostSchema);