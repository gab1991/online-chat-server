import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarGenerator } from 'services';

import { GetProfileServiceDto } from './dto/getProfile.dto';

import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileRepository) private profileRepository: ProfileRepository,
    private avatarGenerator: AvatarGenerator
  ) {}

  async getProfile(getProfieServiceDto: GetProfileServiceDto): Promise<Profile | undefined> {
    const { id, host } = getProfieServiceDto;

    const profile = await this.profileRepository.findOneOrFail(id, { relations: ['chats'] });
    profile.avatarUrl = this.avatarGenerator.generateAvatarPath(profile.avatarUrl, host);

    return profile;
  }

  async updateAvatarUrl(userId: number, avatarPath: string): Promise<Profile> {
    const profile = await this.profileRepository.findOneOrFail({ where: { user: { id: userId } } });
    profile.avatarUrl = avatarPath;

    return this.profileRepository.save(profile);
  }
}
