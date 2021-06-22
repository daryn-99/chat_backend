const { Schema, model } = require('mongoose');


const RoleSchema = Schema({
    name: String
}, {
    versionKey: false
})


module.exports = model('Role', RoleSchema);