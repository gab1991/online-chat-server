import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { GetProfileParamsDto } from './dto/getProfile.dto';
import { AuthenticatedUser } from 'modules/auth/decorators';
import { JwtAuthGuard } from 'modules/auth/passport/jwt.guard';
import { User } from 'modules/user/user.entity';

import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request, @Param() getProfileParamsDto: GetProfileParamsDto): Promise<Profile | undefined> {
    const host = req.get('host');

    if (!host) {
      throw new InternalServerErrorException();
    }

    return this.profileService.getProfile({ ...getProfileParamsDto, host });
  }

  @Post(':id/uploadAvatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'public/avatars',
      fileFilter: (req, file, cb) => {
        // console.log(file);
        cb(null, true);
      },
    })
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Param() id: string, @AuthenticatedUser() user: User) {
    console.log(id);
    console.log(file);
  }
}
