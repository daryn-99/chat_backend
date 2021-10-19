const mongoose = require('mongoose');


const dbConnection = async() => {

    try {
        await mongoose.connect( 'mongodb://chat_admin:buakKasqBM3235kX@cluster0-shard-00-00.woral.mongodb.net:27017,cluster0-shard-00-01.woral.mongodb.net:27017,cluster0-shard-00-02.woral.mongodb.net:27017/chat?authSource=admin&replicaSet=atlas-gbbs3x-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', {
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

// const configs = {
//     appConfig: 
//     {
//         port: process.env.PORT
//     }
// }

module.exports = {
    dbConnection,
    //configs
}