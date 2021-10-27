const Usuario = require('../models/usuario');

class UsuarioService {
    UsuarioService() {}


    async eliminarcliente(idc) {
        console.log(idc);
        var clienteEliminado;
        try {
            await clientemodel.findOneAndRemove({
                _id: idc
            }).then( (value) => {
                console.log(value);
                clienteEliminado = value;
            });

            return clienteEliminado;
        } catch (error) {
            console.log(error);

        }
    }

    async modificarUsuario(usermod) {

        var usuarioModificado;
        try {
            await Usuario.findOneAndUpdate({
                _id: usermod._id
            }, usermod).then( (value) => {

                usuarioModificado = usermod;
            });

            return usuarioModificado;
        } catch (error) {
            console.log(error);

        }
    }
}

module.exports = new UsuarioService();