import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModel } from 'src/products/products.model';
import {BotService} from "../bot/bot.service";

@Module({
  controllers: [SearchController],
  providers: [SearchService,BotService],
  imports: [
    SequelizeModule.forFeature([ProductsModel]),
  ],
})
export class SearchModule {}
