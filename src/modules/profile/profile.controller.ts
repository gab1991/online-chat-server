import { Controller, Get, InternalServerErrorException, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { GetProfileParamsDto } from './dto/getProfile.dto';
import { JwtAuthGuard } from 'modules/auth/passport/jwt.guard';

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
}
