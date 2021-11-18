import { EntityRepository, Repository } from 'typeorm';

import { User } from 'user/user.entity';

import { Profile } from './profile.entity';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {
  async createProfile(user: User): Promise<Profile> {
    const profile = this.create({ displayedName: user.name, user });
    return await this.save(profile);
  }
}
