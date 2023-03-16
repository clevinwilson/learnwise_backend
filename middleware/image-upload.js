const multer = require('multer');

//image filter 
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/gif' ||
        file.mimetype == 'image/webp' ||
        file.mimetype == 'image/avif'

    ) {
        cb(null, true)
    }
    else {
        cb(null, false);
        cb(new Error('Only jpeg,  jpg , png, avif and gif Image allow'))
    }
};


//uploads course img
const courseStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/course/thumbnail");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const uploadCourseImage = multer({ storage: courseStorage }).fields([{ name: 'image', maxCount: 1 }])




module.exports = { uploadCourseImage };