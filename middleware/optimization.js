const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const optimizeImage = async (req, res, next) => {
    // Verification of file upload
    if (!req.file) return next();

    // Definition of new name of file and output path
    const newFilename = `image_${Date.now()}.webp`;
    const outputPath = path.join(__dirname, '../images', newFilename);
    const publicUrl = `${req.protocol}://${req.get('host')}/public/${newFilename}`

    try {
        // Use sharp to optimize image in resolution, format and quality
        await sharp(req.file.buffer)
            .resize(800)
            .webp({ quality: 90 })
            .toFile(outputPath);

        // Update informations in the object
        req.file.path = outputPath;
        req.file.filename = newFilename;
        req.file.url = publicUrl;

        // Go to next function
        next();
    } catch (error) {
        console.error('Error optimizing image', error);
        res.status(500).send('Failed to process image');
    }
};

module.exports = optimizeImage;
