import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateOrderDto} from './dto/create-order.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {OrdersModel} from './orders.model';
import {InjectModel} from '@nestjs/sequelize';
import {ProductsModel} from 'src/products/products.model';
import {OrderProductsModel} from './ordersProducts.model';
import {BotService} from "../bot/bot.service";
import {UsersService} from "../users/users.service";
import {CategoriesModel} from "../categories/categories.model";
import {Op} from "sequelize";

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(OrdersModel)
        private ordersRepository: typeof OrdersModel,
        @InjectModel(CategoriesModel)
        private categoriesRepository: typeof CategoriesModel,
        private readonly botService: BotService,
        private readonly usersService: UsersService,
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
            const adminId = await this.usersService.findAdmin()
            await this.botService.notification(adminId, order)
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
            return this.ordersRepository.findAll({
                order: [
                    ['id', 'DESC']
                ],
                include: {all: true}
            });
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
            return this.ordersRepository.findAll({
                where: {userId},
                order: [
                    ['id', 'DESC']
                ],
                include: {all: true}
            });
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
            const data = {...order.dataValues}
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
            const order = await this.ordersRepository.findOne({where: {id}});
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

    async statistics(query: any) {

        try {
            let productsInOrders = []
            let categoryStat = []
            const orders = await this.ordersRepository.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [query.startTime, query.endTime],
                    },
                },
                include: {all: true}
            });

            for (let products of orders) {
                productsInOrders.push(...products.orderProducts)
            }
            if (query.catId) {
                const arr = productsInOrders.filter(item => item.categoryId == query.catId)
                const productsCounts = arr.reduce((item, product) => {
                    console.log(product)
                    console.log(item)
                    const productId = product.id;
                    item[productId] = item[productId] || {count: 0, products: []};
                    item[productId].count++;
                    item[productId].products.push(product);

                    return item;
                }, {});

                for (const categoryId in productsCounts) {
                    categoryStat.push({category: categoryId, count: productsCounts[categoryId].count})
                }
                // return {arr}
            } else {
                const categoryCounts = productsInOrders.reduce((item, product) => {
                    const categoryId = product.categoryId;
                    item[categoryId] = item[categoryId] || {count: 0, products: []};
                    item[categoryId].count++;
                    item[categoryId].products.push(product);

                    return item;
                }, {});

                for (const categoryId in categoryCounts) {
                    const category = await this.categoriesRepository.findOne({where: {id: categoryId}})
                    categoryStat.push({category: category.title, count: categoryCounts[categoryId].count})
                }


            }
            const gain = productsInOrders.reduce((total, product) => total + product.price * product.count, 0);
            const countOfOrders = orders.length;
            const averageCheck = gain / countOfOrders;
            return {gain, countOfOrders, averageCheck, categoryStat};

        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении статистики: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении статистики: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
