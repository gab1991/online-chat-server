import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserCreationDto } from 'src/user/dto/userCreation.dto';
import { AuthService } from './auth.service';
import { AppError, ArrErrorCode } from 'src/utils/appError';

@Controller('auth')
export class AuthController {
  constructor(private authServie: AuthService) {}
  @Post('/signup')
  async signUp(@Body() userCreationDto: UserCreationDto): Promise<void> {
    try {
      await this.authServie.signUp(userCreationDto);
    } catch (err) {
      if (err instanceof AppError && err.appErrCode == ArrErrorCode.username_exist) {
        throw new BadRequestException(`name ${userCreationDto.name} is already taken`);
      }
      if (err instanceof AppError && err.appErrCode == ArrErrorCode.email_exist) {
        throw new BadRequestException(`email ${userCreationDto.email} is already taken`);
      }
      throw err;
    }
  }
}
