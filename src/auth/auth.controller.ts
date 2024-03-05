import {Controller, Post, Body, HttpCode, HttpStatus} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthDto} from "./dto/auth.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @HttpCode(HttpStatus.OK)
    @Post('')
    register(@Body() dto: AuthDto) {
        return this.authService.authentication(dto);
    }
}
