const multer = require('multer');
const fs = require('fs');
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const destPath = path.join(__dirname, '../public/product/image');// when the other image upload are neccesaary like categroy image
        // add this code in middlewares folder 
        /* exports.setUploadPath = (uploadPath) => {
                     return (req, res, next) => {
                         req.uploadPath = uploadPath;
                         next();
                     }
                 }; */
        if (!fs.existsSync(destPath))
            fs.mkdirSync(destPath,{ recursive: true});
        callback(null, destPath);
    },
    filename: function (req, file, callback) {
        const parts = file.originalname.split(".");
        const extension = parts[parts.length - 1];
        let fileName = file.fieldname + '-' + Date.now();
        if (extension === 'png' || extension === 'jpeg' || extension === 'jpg')
            fileName += '.' + extension;

        callback(null, fileName);
    }
});


const upload = multer({ storage: storage });

module.exports = { upload };