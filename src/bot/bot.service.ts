import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv'
dotenv.config();
import * as TelegramBot from'node-telegram-bot-api'
const token = process.env.BOT_TOKEN;

export const bot = new TelegramBot(token, { polling: true });

@Injectable()
export class BotService {
    async  errorMessage(text:string){
        for (let chatId of process.env.BOT_CHAT_ID_MESSAGE_ERROR.split(",")) {
            await bot.sendMessage(chatId, `${text}`)
        }
    }
    async notification(idOrder:number){
        for (let chatId of process.env.BOT_CHAT_ID_MESSAGE.split(",")) {
            await bot.sendMessage(chatId, 'Появился новый заказ', {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Посмотреть заказ', web_app: {url: `${process.env.WEB_APP_URL}/order/${idOrder}`}}]
                    ]
                }
            })
        }

    }
}
