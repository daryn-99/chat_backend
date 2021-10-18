const { Schema, model} = require('mongoose');
const { ObjectId } = Schema.Types;


const RoleSchema = Schema({
    name: String,
    user: {
        type: ObjectId,
        ref: 'Usuario'
    }
}, {
    versionKey: false
})


module.exports = model('Role', RoleSchema);