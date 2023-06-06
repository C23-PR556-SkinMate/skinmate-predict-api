const rateLimit = require('express-rate-limit');
const multer = require('multer');

const scanLimitter = rateLimit({
    windowMs: 60 * 1000,
    max: 45,
    message: 'You have exceeded the request limit',
});

const multerMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const getImageType = (file) => {
    return file.slice(((file.lastIndexOf('.') - 1) >>> 0) + 2);
};

const validateImageType = (file) => {
    const { originalname, mimetype } = file;

    const allowedFiles = ['png', 'jpg', 'jpeg'];
    const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    const fileExt = getImageType(originalname);

    if (!allowedFiles.includes(fileExt) || !allowedFileTypes.includes(mimetype)) {
        return false;
    }

    return true;
};

module.exports = {
    scanLimitter,
    multerMiddleware,
    getImageType,
    validateImageType,
};