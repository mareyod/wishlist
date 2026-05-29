const Router = require('express').Router;
const userController = require('../controllers/user-controller')
const router = new Router()
const {body} = require('express-validator')
const upload = require('../middlewares/upload-avatar')
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.post('/uploadAvatar', upload.single('file'), userController.uploadAvatar);
router.post('/changeAvatar', authMiddleware, upload.single('file'), userController.changeAvatar);
module.exports = router