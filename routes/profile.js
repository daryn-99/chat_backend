/*
    path: api/profile

*/

const { Router } = require('express');
const { validarJWT} = require('../middlewares/validar-jwt');
const {addProfile, updateProfileImg, getProfileById} = require('../controllers/profile');
const upload = require('../middlewares/storage');

const router = Router();

router.get('/checkprofile', validarJWT, getProfileById );

router.post('/add', validarJWT, addProfile);

router.patch('/add/profileimg', validarJWT, upload.single('imgUrl'), updateProfileImg)

// //adding and update profile image
// router
//     .route("/add/image")
//     .patch(validarJWT, upload.single("img"), (req, res) => {
//         Profile.findOneAndUpdate(
//             { username: req.decoded.username },
//             {
//                 $set: {
//                     imgUrl: req.file.path,
//                 },
//             },
//             { new: true },
//             (err, profile) => {
//                 if (err) return res.status(500).send(err);
//                 const response = {
//                     message: "image added successfully updated",
//                     data: profile,
//                 };
//                 return res.status(200).send(response);
//             }
//         );
//     });

// router.route("/add").post(validarJWT, (req, res) => {
//     const profile = Profile({
//         about: req.body.about,
//     });
//     profile
//         .save()
//         .then(() => {
//             return res.json({ msg: "profile successfully stored" });
//         })
//         .catch((err) => {
//             return res.status(400).json({ err: err });
//         });
// });

// // Check Profile data

// router.route("/checkProfile").get(validarJWT, (req, res) => {
//     Profile.findOne({ username: req.decoded.username }, (err, result) => {
//         if (err) return res.json({ err: err });
//         else if (result == null) {
//             return res.json({ status: false, username: req.decoded.username });
//         } else {
//             return res.json({ status: true, username: req.decoded.username });
//         }
//     });
// });
// router.route("/getData").get(validarJWT, (req, res) => {
//     Profile.findOne({ username: req.decoded.username }, (err, result) => {
//         if (err) return res.json({ err: err });
//         if (result == null) return res.json({ data: [] });
//         else return res.json({ data: result });
//     });
// });
// router.route("/update").patch(validarJWT, async (req, res) => {
//     let profile = {};
//     await Profile.findOne({ username: req.decoded.username }, (err, result) => {
//         if (err) {
//             profile = {};
//         }
//         if (result != null) {
//             profile = result;
//         }
//     });
//     Profile.findOneAndUpdate(
//         { username: req.decoded.username },
//         {
//             $set: {
//                 about: req.body.about ? req.body.about : profile.about, //about:""
//             },
//         },
//         { new: true },
//         (err, result) => {
//             if (err) return res.json({ err: err });
//             if (result == null) return res.json({ data: [] });
//             else return res.json({ data: result });
//         }
//     );
// });
module.exports = router;