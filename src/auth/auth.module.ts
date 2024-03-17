import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersService} from "../users/users.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {UsersModel} from "../users/users.model";
import {TokenService} from "../token/token.service";
import {JwtService} from "@nestjs/jwt";
import {JwtStrategy} from "../strategy/strategy";
import {BotService} from "../bot/bot.service";
import * as TelegramBot from "node-telegram-bot-api";

@Module({
  controllers: [AuthController],
  providers: [AuthService,UsersService,TokenService, JwtService,JwtStrategy,BotService,TelegramBot],
  imports: [SequelizeModule.forFeature([UsersModel])],
})
export class AuthModule {}
