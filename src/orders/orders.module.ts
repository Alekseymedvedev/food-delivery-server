import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersModel } from './orders.model';
import { ProductsModel } from 'src/products/products.model';
import { OrderProductsModel } from './ordersProducts.model';
import {BotService} from "../bot/bot.service";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService,BotService],
  imports: [
    SequelizeModule.forFeature([OrderProductsModel,OrdersModel, ProductsModel]),
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
