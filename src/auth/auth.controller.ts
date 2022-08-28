import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/locat-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const token = await this.authService.login(req.user);
    res.cookie('arcon_jwt_token', token, {
      secure: process.env.APP_ENV !== 'development',
      httpOnly: process.env.APP_ENV === 'development',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.APP_ENV === 'development' ? 'Lax' : 'none',
    });

    const newUser = await this.authService.getUserDetails(req.user.username);
    res.send(newUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getUserDetails(req.user.username);
  }

  @Post('register')
  async register(@Request() req, @Response() res) {
    if (process.env.APP_ENV === 'development') {
      const user: CreateUserDto = {
        username: req.body.username,
        password: req.body.password,
      };
      const newUser = await this.authService.register(user);
      res.send(newUser);
    }
  }

  @Post('logout')
  logout(@Request() req, @Response() res) {
    return res
      .clearCookie('arcon_jwt_token')
      .status(200)
      .send('Successfully Logged Out');
  }
}
