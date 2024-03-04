import { Injectable } from '@nestjs/common';
import { ProductsModel } from 'src/products/products.model';
import { Op } from 'sequelize';
import {InjectModel} from "@nestjs/sequelize";
import {OrdersModel} from "../orders/orders.model";
import {BotService} from "../bot/bot.service";

@Injectable()
export class SearchService {
  constructor( private readonly botService: BotService) {}
  async search(query: string){

    try{
      const products = await ProductsModel.findAll({
          where: { title: { [Op.iLike]: `%${query["search"]}%` } },
        include:{all:true}
      });
  
      return products;
    }catch(e){
      await this.botService.errorMessage(`Произошла ошибка при поиске: ${e}`)
    }
  }
}
