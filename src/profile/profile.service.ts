import { Injectable } from '@nestjs/common';

import { GetProfileParamsDto } from './dto/getProfile.dto';

import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async getProfile(getProfileDto: GetProfileParamsDto): Promise<Profile | undefined> {
    const { id } = getProfileDto;
    console.log(typeof id);
    return await this.profileRepository.findOneOrFail(id);
  }
}
