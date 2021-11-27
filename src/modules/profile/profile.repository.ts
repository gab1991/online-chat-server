import { EntityRepository, Repository } from 'typeorm';

import { Profile } from './profile.entity';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {
  async getProfilesByQuery(acceptableParams: { name?: string }): Promise<Profile[]> {
    const { name } = acceptableParams;

    const builder = this.createQueryBuilder('p').leftJoinAndSelect('p.user', 'u');

    if (name) {
      builder.andWhere(
        'LOWER(p.displayedName) LIKE LOWER(:displayedName) OR LOWER(u.name) LIKE LOWER(:displayedName)',
        {
          displayedName: `%${name}%`,
        }
      );
    }

    return await builder.getMany();
  }
}
