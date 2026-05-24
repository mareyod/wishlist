const multer = require('multer')
const path = require('path')
const uuid = require('uuid')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/avatars')
    },

    filename(req, file, cb) {
        const ext = path.extname(file.originalname)

        cb(null, uuid.v4() + ext)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    } else {
        cb(new Error('Только изображения'))
    }
}

module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024
    }
})