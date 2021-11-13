import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto, UserCreationDto } from 'src/user/dto';
import { User } from 'src/user/user.entity';
import { UsersRepository } from 'src/user/user.repository';
import { compare } from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository
  ) {}

  async signUp(userCreationDto: UserCreationDto): Promise<void> {
    await this.usersRepository.createUser(userCreationDto);
  }

  async signIn(userLoginDto: UserLoginDto): Promise<User> {
    const { nameOrEmail, password } = userLoginDto;
    const user = await this.usersRepository.findByNameOrEmail(nameOrEmail);

    if (user && (await compare(password, user.password))) {
      return user;
    }

    throw new UnauthorizedException('Credentials are not valid');
  }
}
