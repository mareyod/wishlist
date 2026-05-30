import jwt from "jsonwebtoken";

import tokenModel from "../models/token-model";

import { JwtUserPayload, TokenPair } from "../types/auth.types";
import { TokenEntity } from "../types/token.types";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Требуется переменная окружения ${name}`);
  }

  return value;
}

class TokenService {
    generateTokens(payload: JwtUserPayload): TokenPair {
        const accessToken = jwt.sign(payload, getEnv("JWT_ACCESS_SECRET"), {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, getEnv("JWT_REFRESH_SECRET"), {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token: string): JwtUserPayload | null{
        try {
            const userData = jwt.verify(token, getEnv("JWT_ACCESS_SECRET")) as JwtUserPayload
            return userData
        } catch(e){
            return null
        }
    }

    validateRefreshToken(token: string): JwtUserPayload | null{
        try {
            const userData = jwt.verify(token, getEnv("JWT_REFRESH_SECRET")) as JwtUserPayload
            return userData
        } catch(e){
            return null
        }
    }


    async saveToken(userId: number, refreshToken: string): Promise<TokenEntity>{
        const tokenData = await tokenModel.findByUserId(userId)
        if(tokenData){
            return await tokenModel.updateToken(userId, refreshToken)
        }

        return await tokenModel.create(userId, refreshToken)
    }

    async removeToken(refreshToken: string): Promise<TokenEntity | undefined>{
        return await tokenModel.deleteToken(refreshToken)
    }

    async findToken(refreshToken: string): Promise<TokenEntity | undefined>{
        return await tokenModel.findToken(refreshToken)
    }
}

export default new TokenService();