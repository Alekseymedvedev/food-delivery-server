import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {BotService} from "../bot/bot.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly botService: BotService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_ACCESS_SECRET
        });
    }

    async validate(payload: any) {
        try {
            if (payload?.role === 'admin' || payload?.role === 'superAdmin') {
                return true
            } else {
                await this.botService.errorMessage(`Произошла ошибка доступа, доступ разрешен только admin. Пользователь ${payload.chatId}: `)
                throw new UnauthorizedException('Доступ разрешен только admin')
            }

        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка доступа, доступ разрешен только admin: ${e}`)
            throw new UnauthorizedException('Доступ разрешен только admin')
        }
    }
}

