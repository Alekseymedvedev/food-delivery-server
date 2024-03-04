import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersModel} from './users.model';
import {InjectModel} from '@nestjs/sequelize';
import {UsersDto} from './users.dto';
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv';
import {BotService} from "../bot/bot.service";
dotenv.config();

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersModel) private usersRepository: typeof UsersModel,
        private readonly botService: BotService) {
    }



    async findOne(chatId: string) {
        return this.usersRepository.findOne({where:{chatId}});
    }
    async createUser(dto: UsersDto) {
        try {
           const user = await UsersModel.create({...dto})
            return user
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при создании пользователя: ${e}`)
            throw new HttpException(
                `Произошла ошибка при создании пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    async updateUser(id: number, dto: Partial<UsersDto>) {
        try {
            const user = await this.usersRepository.findByPk(id);
            if (!user) {
                throw new Error('Product not found');
            }
            await user.update(dto);
            return dto;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при обновлении пользователя: ${e}`)
            throw new HttpException(
                `Произошла ошибка при обновлении пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    async updateRoleUser(username:string) {
        console.log('username',username)
        try {
            const user = await this.usersRepository.findOne({where:{username}});
            console.log('user',user)
            await user.update({role:'admin'});
            return user;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при обновлении роли пользователя: ${e}`)
            throw new HttpException(
                `Произошла ошибка при обновлении роли пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
