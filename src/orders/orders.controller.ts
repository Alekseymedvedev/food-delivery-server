import {Controller, Get, Post, Body, Param, Delete, Patch, UseInterceptors, UploadedFile} from '@nestjs/common';
import {OrdersService} from './orders.service';
import {CreateOrderDto} from './dto/create-order.dto';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CategoriesModel} from "../categories/categories.model";
import {OrdersModel} from "./orders.model";
import {ProductsModel} from "../products/products.model";
import {FileInterceptor} from "@nestjs/platform-express";
import {ProductsDto} from "../products/products.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {BotService} from "../bot/bot.service";

@ApiTags('Заказы')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {
    }

    @ApiOperation({summary: 'Создание заказа'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(dto);
    }

    @ApiOperation({summary: 'Получение всех заказов'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Get()
    findAll() {
        return this.ordersService.findAllOrder();
    }

    @ApiOperation({summary: 'Получение заказов пользователя'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Get('user/:id')
    findAllOrdersUser(@Param('id') id: string) {
        return this.ordersService.findAllOrdersUser(+id);
    }

    @ApiOperation({summary: 'Получение одного заказа'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOneOrder(+id);
    }

    @ApiOperation({summary: 'Изменение статуса заказа'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateOrderDto,) {
        return this.ordersService.updateOrder(+id, dto,);
    }
}
