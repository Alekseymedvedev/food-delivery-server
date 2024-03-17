import {Injectable} from '@nestjs/common';

@Injectable()
export class BotService {




    async errorMessage(text: string) {
        // for (let chatId of process.env.BOT_CHAT_ID_MESSAGE_ERROR.split(",")) {
        //     await this.bot.sendMessage(chatId, `${text}`)
        // }
    }

    async notification(idOrder: number) {
        // for (let chatId of process.env.BOT_CHAT_ID_MESSAGE.split(",")) {
        //     await this.bot.sendMessage(chatId, 'Появился новый заказ', {
        //         reply_markup: {
        //             inline_keyboard: [
        //                 [{text: 'Посмотреть заказ', web_app: {url: `${process.env.WEB_APP_URL}/order/${idOrder}`}}]
        //             ]
        //         }
        //     })
        // }
    }

    async newAdmin(user: any, adminId: string[]) {
        // for (let admin of adminId) {
        //     await this.bot.sendMessage(admin,
        //         `
        //             Создан новый пользователь!\n
        //             ID: 23235 | Неформальный\n
        //             Chat ID: ${user.chatId}\n
        //             Source: none
        //         `,
        //         {
        //             reply_markup: {
        //                 inline_keyboard: [
        //                     [{text: 'Посмотреть пользователя', web_app: {url: `${process.env.WEB_APP_URL}/update-user/${user.chatId}`}}]
        //                 ]
        //             }
        //         })
        // }
    }

    async updateUser(chatId: string) {
        // for (let admin of process.env.BOT_CHAT_ID_MESSAGE.split(",")) {
        //     await this.bot.sendMessage(admin, `Изменена роль пользователя ${chatId}`, {
        //         reply_markup: {
        //             inline_keyboard: [
        //                 [{text: 'Посмотреть пользователя', web_app: {url: `${process.env.WEB_APP_URL}/update-user/${chatId}`}}]
        //             ]
        //         }
        //     })
        // }
    }

}

