import { AppError, ArrErrorCode } from 'src/utils/appError';
import { Repository, EntityRepository, QueryFailedError } from 'typeorm';
import { UserCreationDto } from './dto/userCreation.dto';
import { User } from './user.entity';
import { DatabaseError } from 'pg';
import * as bcrypt from 'bcrypt';

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
        if ((err.driverError as DatabaseError).detail.match('email')) {
          throw new AppError(ArrErrorCode.email_exist);
        }
        if ((err.driverError as DatabaseError).detail.match('name')) {
          throw new AppError(ArrErrorCode.username_exist);
        }
      }
    }
  }
}
