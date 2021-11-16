import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

  private async validatePass(notEncrypted: string, encrypted: string): Promise<boolean> {
    return await compare(notEncrypted, encrypted);
  }

  async signUp(userCreationDto: UserCreationDto): Promise<void> {
    await this.usersRepository.createUser(userCreationDto);
  }

  async signIn(userLoginDto: UserLoginDto): Promise<User | undefined> {
    const { nameOrEmail, password } = userLoginDto;
    const user = await this.usersRepository.findByNameOrEmail(nameOrEmail);

    if (user && this.validatePass(password, user.password)) {
      return user;
    }
  }
}
