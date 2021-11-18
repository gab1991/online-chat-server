import { Controller, Get, Param } from '@nestjs/common';

import { GetProfileParamsDto } from './dto/getProfile.dto';

import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get(':id')
  getProfile(@Param() getProfileParamsDto: GetProfileParamsDto): Promise<Profile | undefined> {
    return this.profileService.getProfile(getProfileParamsDto);
  }
}
