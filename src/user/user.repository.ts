import * as bcrypt from 'bcrypt';
import { DatabaseError } from 'pg';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';

import { UserCreationDto } from './dto/userCreation.dto';
import { AppError, ArrErrorCode } from 'utils/appError';

import { User } from './user.entity';

const bdUniqnessErrorCode = '23505';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(userCreationDto: UserCreationDto): Promise<User> {
    const { password, name } = userCreationDto;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      ...userCreationDto,
      displayedName: name,
      password: hashPassword,
    });

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
