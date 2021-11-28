import { EntityRepository, Repository } from 'typeorm';

import { Profile } from './profile.entity';

export interface GetProfileByQueryParams {
  name?: string;
  ignoredIds?: number[];
}

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {
  async getProfilesByQuery(params: GetProfileByQueryParams): Promise<Profile[]> {
    const { name, ignoredIds } = params;

    const builder = this.createQueryBuilder('p').leftJoinAndSelect('p.user', 'u');

    if (ignoredIds?.length) {
      builder.andWhere('p.id NOT IN (:...ignoredIds)', { ignoredIds });
    }

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
