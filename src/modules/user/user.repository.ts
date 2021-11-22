import { DatabaseError } from 'pg';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';

import { AppError, ArrErrorCode } from 'utils/appError';

import { User } from './user.entity';

const bdUniqnessErrorCode = '23505';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async saveUserUnique(user: User): Promise<User> {
    try {
      return await this.save(user);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === bdUniqnessErrorCode) {
        const dbErr = err.driverError as DatabaseError;

        if (dbErr.detail?.includes('email')) {
          throw new AppError(ArrErrorCode.email_exist);
        }
        if (dbErr.detail?.includes('name')) {
          throw new AppError(ArrErrorCode.username_exist);
        }
      }
      throw err;
    }
  }

  async findByNameOrEmail(nameOrEmail: string): Promise<User | undefined> {
    return await this.findOne({ where: [{ name: nameOrEmail }, { email: nameOrEmail }] });
  }
}
