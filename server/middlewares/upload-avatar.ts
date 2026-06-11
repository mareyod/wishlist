import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
];

const storage = multer.diskStorage({
    destination(req, file, cb): void {
        cb(null, 'uploads/avatars')
    },
    filename(req, file, cb): void {
        let ext = path.extname(file.originalname).toLowerCase();
        if (!ext) {
            const map: Record<string, string> = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'image/webp': '.webp',
                'image/heic': '.heic',
                'image/heif': '.heif'
            };
            ext = map[file.mimetype] ?? '';
        }
        cb(null, `${uuidv4()}${ext}`)
    }
})

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
       console.log('UPLOAD FILE:', file.originalname, file.mimetype, path.extname(file.originalname));

    if (allowedMimeTypes.includes(file.mimetype)) {
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