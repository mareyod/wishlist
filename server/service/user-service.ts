import bcrypt from 'bcrypt';
import * as uuid from 'uuid';

import UserModel from '../models/user-model';
import mailService from './mail-service';
import tokenService from './token-service';
import UserDto from '../dtos/user-dto';
import ApiError from '../exceptions/api-error';

import type { AuthResponse, JwtUserPayload } from '../types/auth.types';
import { UserDtoInterface, UserEntity } from '../types/user.types';
import { TokenEntity } from '../types/token.types';

type RegistrationInput = {
    email: string;
    password: string;
    nickname: string;
    avatar_url: string | null;
};

type LoginInput = {
    email: string;
    password: string;
};

type UploadedFile = {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
};

class UserService {
    async registration(email: string, password: string, nickname: string, avatar_url: string | null): Promise<AuthResponse>{

        const candidateEmail = await UserModel.findByEmail(email)

        if(candidateEmail){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const candidateNickname = await UserModel.findByNickname(nickname)

        if(candidateNickname){
            throw ApiError.BadRequest( `Никнейм ${nickname} уже занят`)
        }

        const hashPassword: string = await bcrypt.hash(password, 6)

        const activationLink: string  = uuid.v4()

        const user: UserEntity = await UserModel.create(
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

    async activate(activationLink: string): Promise<void> {
        const user = await UserModel.findByLink(activationLink)
        if(!user){
            throw ApiError.BadRequest(`Некорректная ссылка активации`)
        }
        UserModel.activate(activationLink)

    }

    async login(email: string, password: string): Promise<AuthResponse>{

        const user = await UserModel.findByEmail(email)

        if(!user){
            throw ApiError.BadRequest(`Пользователь с таким email не найден`)
        }
        const isPassEquals: boolean = await bcrypt.compare(password, user.password)

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

    async logout(refreshToken: string): Promise<TokenEntity | undefined>{
        return tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string): Promise<AuthResponse> {
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)
        if (!user) {
            throw ApiError.UnauthorizedError();
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }


    async changeAvatar(userId: number, file:  UploadedFile | undefined): Promise<{ user: UserDtoInterface; avatar_url: string }> {
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

export default new UserService();