const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },//TODO:Validar que el numero sea unico
    numerotel: {
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
    //TODO: Agregar fecha de nacimiento, area, cargo, fecha de creacion(Automatica), imagen de perfil(Estipular una por defecto)(Estipular limite de espacio ejemplo: 5mb).

});

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model('Usuario', UsuarioSchema );