import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { FileSystem } from 'services';
import { FindOneOptions } from 'typeorm';

import { GetProfileQuery } from './dto/getProfileQuery.dto';

import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileRepository) private profileRepository: ProfileRepository,
    private fileSystemService: FileSystem
  ) {}

  async getProfile(id: number): Promise<Profile | undefined> {
    const profile = await this.profileRepository.findOneOrFail(id, { relations: ['chats'] });

    return profile;
  }

  async getDetailedProfile(id: number, options?: FindOneOptions<Profile>): Promise<Profile> {
    return this.profileRepository.findOneOrFail(id, { relations: ['chats', 'user'], ...options });
  }

  async updateAvatarUrl(userId: number, avatarPath: string): Promise<Profile> {
    const profile = await this.getDetailedProfile(userId);

    const prevAvatar = profile.avatarUrl;

    if (prevAvatar) {
      this.fileSystemService.removeFileIfExists(join(__dirname, '../../../public/avatars', prevAvatar));
    }

    profile.avatarUrl = avatarPath;

    return await this.profileRepository.save(profile);
  }

  async getProfiles(getProfilesQuery: GetProfileQuery): Promise<Profile[]> {
    return this.profileRepository.getProfilesByQuery(getProfilesQuery);
  }

  async updateDisplayedName(userId: number, displayedName: string): Promise<Profile> {
    const profile = await this.getDetailedProfile(userId, { where: { user: { id: userId } } });
    profile.displayedName = displayedName;
    return await this.profileRepository.save(profile);
  }
}
