import { Controller, Post, Body, UnauthorizedException, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
    ) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        const userObj = user.toObject();
        const { password, ...result } = userObj;
        return result;
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
}