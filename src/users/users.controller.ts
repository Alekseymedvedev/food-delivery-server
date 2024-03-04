import { Body, Controller, Param, Patch,} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './users.dto';
import { UsersModel } from './users.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Пользователь')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiResponse({ status: 200, type: UsersModel })
  @Patch('/update')
  updateRole( @Body() dto: UsersDto ) {
    console.log('dto',dto)
    return this.usersService.updateRoleUser( dto.username);
  }
  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiResponse({ status: 200, type: UsersModel })
  @Patch('/:id')
  update(@Param('id') id: number, @Body() dto: UsersDto ) {
    return this.usersService.updateUser(id, dto);
  }

}
