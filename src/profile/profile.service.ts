import { Injectable } from '@nestjs/common';
import { AvatarGenerator } from 'services';

import { GetProfileServiceDto } from './dto/getProfile.dto';

import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: ProfileRepository, private avatarGenerator: AvatarGenerator) {}

  async getProfile(getProfieServiceDto: GetProfileServiceDto): Promise<Profile | undefined> {
    const { id, host } = getProfieServiceDto;

    const profile = await this.profileRepository.findOneOrFail(id);
    profile.avatarUrl = this.avatarGenerator.generateAvatarPath(profile.avatarUrl, host);

    return profile;
  }
}
