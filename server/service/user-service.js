const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password, nickname, avatar_url){

        const candidateEmail = await UserModel.findByEmail(email)

        if(candidateEmail){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const candidateNickname = await UserModel.findByNickname(nickname)

        if(candidateNickname){
            throw ApiError.BadRequest(
                `Никнейм ${nickname} уже занят`
            )
        }

        const hashPassword = await bcrypt.hash(password, 6)

        const activationLink = uuid.v4()

        const user = await UserModel.create(
            email,
            hashPassword,
            activationLink,
            nickname,
            avatar_url
        )
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink){
        const user = await UserModel.findByLink(activationLink)
        if(!user){
            throw ApiError.BadRequest(`Некорректная ссылка активации`)
        }
        UserModel.activate(activationLink)

    }

    async login(email, password){

        const user = await UserModel.findByEmail(email)

        if(!user){
            throw ApiError.BadRequest(`Пользователь с таким email не найден`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)

        if(!isPassEquals){
            throw ApiError.BadRequest(`Неверный логин или пароль`)
        }

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async getProfile(nickname) {

        const user =  UserModel.findByNickname(nickname)

        if (!user) {
            throw ApiError.NotFound()
        }

        return new UserDto(user)
    }

    async changeAvatar(userId, file) {
        if (!file) {
            throw ApiError.BadRequest('Файл не загружен');
        }

        const avatar_url = `/uploads/avatars/${file.filename}`;

        const user = await UserModel.updateAvatar(userId, avatar_url);

        const userDto = new UserDto(user);

        return {
            user: userDto,
            avatar_url
        };
    }
}

module.exports = new UserService()