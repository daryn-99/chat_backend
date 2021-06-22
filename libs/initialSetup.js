const Role = require('../models/role');

const createRole = async () => {

    try {
        const count = await Role.estimatedDocumentCount()

        if (count > 0)
            return 
        

        const values = await Promise.all([
            new Role({ name: "administrador" }).save(),
            new Role({ name: "gerente" }).save(),
            new Role({ name: "empleado" }).save(),
        ]);

        console.log(values);
    } catch (error) {
        console.error(error);
    }

}


module.exports = {
    createRole
}
