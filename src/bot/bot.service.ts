import {Injectable} from '@nestjs/common';
import {tgBot} from "./bot";

@Injectable()
export class BotService{

    async errorMessage(text: string) {
        for (let chatId of process.env.BOT_CHAT_ID_MESSAGE_ERROR.split(",")) {
            await tgBot.sendMessage(chatId, `${text}`)
        }
    }

    async notification(order: any) {
        for (let chatId of process.env.BOT_CHAT_ID_MESSAGE.split(",")) {

            await tgBot.sendMessage(
                chatId,
                `Появился новый заказ \nАдрес:${order.address}\nИмя:${order.name}\nТелефон:${order.phone}\nТип доставки:${order.typeDelivery}\nМетод оплаты:${order.paymentMethod}`,
                {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Посмотреть заказ', web_app: {url: `${process.env.WEB_APP_URL}/order/${order.id}`}}]
                    ]
                }
            })
        }
    }

    async newAdmin(user: any, adminId: string[]) {
        for (let admin of adminId) {
            await tgBot.sendMessage(admin,
                `Создан новый пользователь!\nID: 23235 | Неформальный\nChat ID: ${user.chatId}\nSource: none`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Посмотреть пользователя', web_app: {url: `${process.env.WEB_APP_URL}/update-user/${user.chatId}`}}]
                        ]
                    }
                })
        }
    }

    async updateUser(chatId: string) {
        for (let admin of process.env.BOT_CHAT_ID_MESSAGE.split(",")) {
            await tgBot.sendMessage(admin, `Изменена роль пользователя ${chatId}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Посмотреть пользователя', web_app: {url: `${process.env.WEB_APP_URL}/update-user/${chatId}`}}]
                    ]
                }
            })
        }
    }

}

