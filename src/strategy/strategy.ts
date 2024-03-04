import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import {BotService} from "../bot/bot.service";

@Injectable()
export class JwtStrategy  extends PassportStrategy(Strategy){
    constructor(private readonly botService: BotService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_ACCESS_SECRET
        });
    }


    async validate(payload: any) {
        try {
            if(payload?.role==='admin'){
            return true
        }else{
                await this.botService.errorMessage(`Произошла ошибка авторизации: `)
                throw new UnauthorizedException('Only admins are allowed')
            return { ...payload.user}

        }

        }catch (e) {
            await this.botService.errorMessage(`Произошла ошибка авторизации: ${e}`)
            throw new UnauthorizedException('Only admins are allowed')
        }
    }
}

