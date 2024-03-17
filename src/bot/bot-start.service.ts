import {Injectable} from '@nestjs/common';
import * as dotenv from 'dotenv'

dotenv.config();
import * as TelegramBot from 'node-telegram-bot-api'
import {TextMessageService} from "../text-message/text-message.service";
import {ContactsService} from "../contacts/contacts.service";

const token = process.env.BOT_TOKEN;

export const tgBot = new TelegramBot(token, {polling: true})


const inlineKeyboardBtn = {
    contacts: 'Контакты',
    welcomeMessage: 'Приветственное сообщение',
}
const keyboardBtn = {
    contacts: 'Контакты',
    admin: 'Меню администратора',
}

@Injectable()
export class BotStartService {

    bot: TelegramBot
    dataBtn: string
    chatId: number
    newMessage: string
    welcomeText: string
    contacts: { address: string, phone: string, worktime: string }

    constructor(private textService: TextMessageService, private contactsService: ContactsService) {
        this.bot = tgBot
        this.start()
    }

    async callbackQuery(message: string, textBtn: string, callbackData: string) {
        this.dataBtn = callbackData
        await this.bot.sendMessage(this.chatId, message, {
            reply_markup: {
                inline_keyboard: [
                    [{text: textBtn, callback_data: callbackData}]
                ]
            }
        })
    }

    start() {

        this.bot.on('message', async msg => {
            console.log(msg)
            const chatId = msg.chat.id
            const text = msg.text
            this.newMessage = text
            if (text === '/start') {
                const welcomeText = await this.textService.findOne('welcomeMessage')
                const contacts = await this.contactsService.findOne(1)
                this.welcomeText = welcomeText.text
                this.contacts = contacts
                await this.bot.sendMessage(chatId, this.welcomeText, {
                    disable_notification: true,
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [{text: keyboardBtn.contacts}, {text: keyboardBtn.admin,}]
                        ]
                    },
                })
                return
            }
            if (msg.text === keyboardBtn.admin) {
                await this.bot.sendMessage(chatId, keyboardBtn.admin, {
                    disable_notification: true,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: inlineKeyboardBtn.contacts, callback_data: 'contacts',},
                                {text: inlineKeyboardBtn.welcomeMessage, callback_data: 'welcomeMessage',}
                            ]

                        ],
                    },
                })
            }
            if (msg.text === keyboardBtn.admin) {
                await this.bot.sendMessage(
                    this.chatId,
                    `
                    Адрес заведения: ${this.contacts.address}\n
                    Номер телефона заведения: ${this.contacts.phone}\n
                    Часы работы: ${this.contacts.worktime}\n
                    `
                )
            }
        })

        this.bot.on('callback_query', async msg => {
            this.chatId = msg.from.id
            if (msg.data === 'contacts') {
                await this.callbackQuery(
                    `
                    Контакты:\n\n
                    Адрес заведения: ${this.contacts.address}\n
                    Номер телефона заведения: ${this.contacts.phone}\n
                    Часы работы: ${this.contacts.worktime}\n\n
                    Для редактирования введите контакты через запятую.
                    Напирмер:улю Ленина д1, с 10.00 до 22.00, +7(911)-111-11-11
                    `,
                    'Редактировать контакты',
                    'editContacts')
            }
            if (msg.data === 'welcomeMessage') {
                await this.callbackQuery('Приветственное сообщение', 'Сохранить приветственное сообщение', 'saveWelcomeMessage')
            }
            if (msg.data === 'saveWelcomeMessage') {
                if (this.welcomeText) {
                    await this.textService.update({text: this.newMessage, type: 'welcomeMessage'})
                } else {
                    await this.textService.create({text: this.newMessage, type: 'welcomeMessage'})
                }
                await this.bot.sendMessage(this.chatId, 'Сообщение сохранено')
            }
            if (msg.data === 'editContacts') {
                const arr = this.newMessage.split(',')
                this.contacts = {address:arr[0],worktime:arr[1],phone:arr[2]}
                if (this.welcomeText) {
                    await this.contactsService.update(1,this.contacts)
                } else {
                    await this.contactsService.create(this.contacts)
                }
                await this.callbackQuery('Контакты', 'Сохранить контакты', 'saveContacts')
            }
        })
    }

}


