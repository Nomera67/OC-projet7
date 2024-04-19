const multer = require('multer');
const path = require('path');

const extensionAccepted = [".png", ".jpeg", ".jpg", ".webp"];

const storage = multer.memoryStorage();

const filter = (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!extensionAccepted.includes(ext)) {
        return callback(new Error("Ce fichier ne possède pas l'extension requise"), false);
    }
    callback(null, true);
};

const upload = multer({ storage: storage, fileFilter: filter });

module.exports = upload;
