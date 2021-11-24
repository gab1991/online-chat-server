import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(ProfileRepository) private profileRepository: ProfileRepository) {}

  async getProfile(id: number): Promise<Profile | undefined> {
    const profile = await this.profileRepository.findOneOrFail(id, { relations: ['chats'] });

    return profile;
  }

  async updateAvatarUrl(userId: number, avatarPath: string): Promise<Profile> {
    const profile = await this.profileRepository.findOneOrFail({ where: { user: { id: userId } } });
    profile.avatarUrl = avatarPath;

    return await this.profileRepository.save(profile);
  }
}
