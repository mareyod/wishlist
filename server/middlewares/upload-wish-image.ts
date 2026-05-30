import multer, { FileFilterCallback } from 'multer';

import path from 'path';

import { v4 as uuidv4 } from 'uuid';


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/wishes')
    },

    filename(req, file, cb) {
        const ext = path.extname(file.originalname)

        cb(
            null,
            `${uuidv4()}${ext}`
        )
    }
})

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
] as const

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {

    if (allowedMimeTypes.includes( file.mimetype as (typeof allowedMimeTypes)[number])) {
        cb(null, true)
        return
    } else {
        cb(
            new Error( 'Допустимы только JPG PNG WEBP')
        )
    }
}

export default multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 8 * 1024 * 1024
    }
})