import {Body, Controller, Get, Param, Patch, UseGuards,} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersDto} from './users.dto';
import {UsersModel} from './users.model';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from "../auth/auth.guard";
import {ProductsModel} from "../products/products.model";

@ApiTags('Пользователь')
@Controller('api/user')
export class UsersController {
    constructor(private usersService: UsersService) {
    }
    @ApiOperation({summary: 'Получение всех пользователей'})
    @ApiResponse({status: 200, type: UsersModel})
    @Get('')
    getAll() {
        return this.usersService.getAll();
    }
    @ApiOperation({summary: 'Получение пользователя'})
    @ApiResponse({status: 200, type: UsersModel})
    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
    @UseGuards(JwtAuthGuard)
    @Patch('/update/:id')
    updateRole(@Param('id')  id:string) {
        return this.usersService.updateRoleUser(id);
    }

    @ApiOperation({summary: 'Обновление данных пользователя'})
    @ApiResponse({status: 200, type: UsersModel})
    @Patch('/:id')
    update(@Param('id') id: number, @Body() dto: UsersDto) {
        return this.usersService.updateUser(id, dto);
    }
}
