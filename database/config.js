const mongoose = require('mongoose');


const dbConnection = async() => {

    try {
        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB Online');
        

    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos - Hable con el admin');
    }

}

const configs = {
    appConfig: 
    {
        host: process.env.DB_CNN,
        port: process.env.PORT
    }
}

module.exports = {
    dbConnection,
    configs
}