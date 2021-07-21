const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./storage/posts");
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// const fileFilter = (req, file, cb) => {
// if (file.mimetype == './storage/imgs/jpeg ' || file.mimetype == './storage/imgs/png') {
//     cb(null, true);
// } else {
//     console.log('Solo se aceptan imagenes en formato jpg y png')
//     cb(null, false);
// }
// }

const postUploads = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
});

module.exports = postUploads
