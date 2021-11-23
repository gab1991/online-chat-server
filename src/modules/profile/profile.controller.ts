import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ImgSaver, Serialize } from 'decorators';
import { Request } from 'express';

import { GetProfileParamsDto } from './dto/getProfile.dto';
import { ProfileDto } from './dto/profile.dto';
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
  @ImgSaver({ dest: 'avatar' })
  @Serialize(ProfileDto)
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param() id: string,
    @AuthenticatedUser() user: User
  ): Promise<Profile> {
    if (Number(id) !== user.id) {
      throw new UnauthorizedException();
    }

    return this.profileService.updateAvatarUrl(user.id, file.filename);
  }
}
