import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {TextMessageModel} from "../text-message/text-message.model";
import {BotStartService} from "./bot-start.service";
import {TextMessageService} from "../text-message/text-message.service";
import {ContactsService} from "../contacts/contacts.service";

@Module({
  providers: [BotService,BotStartService,TextMessageService,ContactsService],
  imports: [SequelizeModule.forFeature([TextMessageModel])],
  exports: [BotService]
})
export class BotModule {}
