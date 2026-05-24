const multer = require('multer')
const path = require('path')
const uuid = require('uuid')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/wishes')
    },

    filename(req, file, cb) {
        const ext = path.extname(file.originalname)

        cb(
            null,
            uuid.v4() + ext
        )
    }
})

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
]

const fileFilter = (
    req,
    file,
    cb
) => {

    if (
        allowedMimeTypes.includes(file.mimetype)
    ) {
        cb(null, true)
    } else {
        cb(
            new Error(
                'Допустимы только JPG PNG WEBP'
            )
        )
    }
}

module.exports = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 8 * 1024 * 1024
    }
})