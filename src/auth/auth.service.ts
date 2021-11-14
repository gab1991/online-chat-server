import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';

import { UserCreationDto, UserLoginDto } from 'user/dto';
import { User } from 'user/user.entity';
import { UsersRepository } from 'user/user.repository';
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
