import { Injectable } from '@nestjs/common';
import {bot} from "../main";

@Injectable()
export class BotService {
    async  errorMessage(text:string){
        for (let chatId of process.env.BOT_CHAT_ID.split(",")) {
            await bot.sendMessage(chatId, `${text}`)

        }
    }
    async notification(idOrder:number){
       await bot.sendMessage(1035451470, 'Появился новый заказ', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Посмотреть заказ', web_app: {url: `${process.env.WEB_APP_URL}/order/${idOrder}`}}]
                ]
            }
        })
    }
}
