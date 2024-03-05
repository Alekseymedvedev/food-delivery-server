import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {TokenService} from "../token/token.service";
import {UsersDto} from "../users/users.dto";
import {BotService} from "../bot/bot.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
                private tokenService: TokenService,
                private readonly botService: BotService) {
    }
    async authentication(dto: UsersDto) {
        try {
            const existUser = await this.usersService.findOne(`${dto.chatId}`)
            const payload = {chatId: dto.chatId, queryId: dto.queryId};

            if (!existUser) {
                const user = await this.usersService.createUser(dto)
                const {id, chatId, username} = user
                return {id, chatId, username, access_token: await this.tokenService.generateJwtToken(payload)};
            } else {
                return {existUser, access_token: await this.tokenService.generateJwtToken({...payload,role:existUser.role})};
            }
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при создании или авторизации пользователя: ${e}`)
            throw new HttpException(
                `Произошла ошибка при создании или авторизации пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,)
        }
    }
}
