import { Body, Controller, Get, Post, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { LoginUserDto } from './dto/login/login-user.dto';
import { RegisterUserDto } from './dto/register/register-user.dto';
import { UpdateProfileDto } from './dto/update/update-profile.dto';
import { Usuario } from './entities/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() usuario: Usuario) {
    return this.authService.checkAuthStatus(usuario);
  }

  @Patch('profile')
  @Auth()
  updateProfile(
    @GetUser() usuario: Usuario,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(usuario, updateProfileDto);
  }
}
