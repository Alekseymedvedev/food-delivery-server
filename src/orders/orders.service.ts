// import { ProductsService } from './../products/products.service';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateOrderDto} from './dto/create-order.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {OrdersModel} from './orders.model';
import {InjectModel} from '@nestjs/sequelize';
import {ProductsModel} from 'src/products/products.model';
import {OrderProductsModel} from './ordersProducts.model';
import {BotService} from "../bot/bot.service";

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(OrdersModel)
        private ordersRepository: typeof OrdersModel,
        private readonly botService: BotService
    ) {
    }

    async createOrder(dto: CreateOrderDto) {
        try {
            const order = await this.ordersRepository.create({...dto});

            let arrProductId = [];
            for (const product of dto.orderProducts) {
                arrProductId.push(product.id);
            }

            await order.$set('orderProducts', arrProductId);
            for (const product of dto.orderProducts) {
                await OrderProductsModel.update(
                    {count: product.count},
                    {where: {products: product.id}},
                );
            }
            await this.botService.notification(order.id)
            return order;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при создании заказа: ${e}`)
            throw new HttpException(
                `Произошла ошибка при создании заказа: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllOrder() {
        try {
            return this.ordersRepository.findAll({include: {all: true}});
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении заказов: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении заказов: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllOrdersUser(userId: number) {
        try {
            return this.ordersRepository.findAll({where: {userId}, include: {all: true}});
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении заказов: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении заказов: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOneOrder(id: number) {
        try {
            const order = await this.ordersRepository.findOne({
                where: {id},
                include: ProductsModel,
            });
            for (const product of order.orderProducts) {
                product.count = await OrderProductsModel.findOne({
                    where: {products: product.id},
                    attributes: ['count'],
                }).then((op) => op?.count || product.count);
            }
            const data = {
                ...order.dataValues
            }
            return data;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении заказа: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении заказа: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateOrder(id: number, dto: UpdateOrderDto) {
        try {
            const order = await this.ordersRepository.findOne({
                where: {id},
            });

            await order.update({...dto});
            return order;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при изменении статуса заказа: ${e}`)
            throw new HttpException(
                `Произошла ошибка при изменении статуса заказа: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
