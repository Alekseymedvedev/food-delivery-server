import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import {UsersService} from "../users/users.service";

@Module({
  providers: [BotService],
  exports: [BotService]
})
export class BotModule {}
