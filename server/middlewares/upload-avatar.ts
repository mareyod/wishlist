import multer, { FileFilterCallback } from 'multer';

import path from 'path';

import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination(req, file, cb):void {
        cb(null, 'uploads/avatars')
    },

    filename(req, file, cb):void {
        const ext = path.extname(file.originalname)

        cb(null, `${uuidv4()}${ext}`)
    }
})

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    } else {
        cb(new Error('Только изображения'))
    }
}

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024
    }
})  