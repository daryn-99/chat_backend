const multer = require('multer');
const express = require('express');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname,'..','storage', 'usuarios')
        // fs.mkdirSync(uploadsDir)
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${req.params.id}-${file.originalname}`);
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