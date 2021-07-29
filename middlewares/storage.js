const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

// const fileFilter = (req, file, cb) => {
// if (file.mimetype == './storage/imgs/jpeg ' || file.mimetype == './storage/imgs/png') {
//     cb(null, true);
// } else {
//     console.log('Solo se aceptan imagenes en formato jpg y png')
//     cb(null, false);
// }
// }

const upload = multer({ 
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    //fileFilter
});

module.exports = upload 