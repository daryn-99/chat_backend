const multer = require("multer");

//Estipula la ruta y nombre con los que se guardarán las imagenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./storage/posts");
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${Date.now()}-${file.originalname}`);
        //cb(null, Date.now().replace(/:|\./g,''), file.originalname);
    },
});


//Filtro de tipo de documento que se agrega en el post
// const fileFilter = (req, file, cb) => {
// if (file.mimetype === 'image/jpg ' || file.mimetype == 'image/png') {
//     cb(null, true);
// } else {
//     console.log('Solo se aceptan imagenes en formato jpg y png')
//     cb(null, false);
// }   
// }

//Estipula el limite de tamaño del archivo a guardar e instancia las funciones anteriores
const postUploads = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
   // fileFilter: fileFilter
});

module.exports = postUploads
