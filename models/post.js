const { Schema, model } = require('mongoose');


const PostSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    caption: { 
        type: String,
    },
    imageUrl: {
        type: String,
        default: "",
    },
    like: {
        type: Number
    },
    comments: {
        type: Number
    }
}, {
    versionKey: false
})


module.exports = model('Post', PostSchema);