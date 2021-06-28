const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/imgs')
    },
    filename: function (req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}.png`)
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
        fileSize: 1024 * 1024 * 6,
    },
    //fileFilter
});

module.exports = upload 