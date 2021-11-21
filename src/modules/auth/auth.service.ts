import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';

import { ProfileRepository } from 'modules/profile/profile.repository';
import { UserCreationDto, UserLoginDto } from 'modules/user/dto';
import { User } from 'modules/user/user.entity';
import { UsersRepository } from 'modules/user/user.repository';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository
  ) {}

  private async validatePass(notEncrypted: string, encrypted: string): Promise<boolean> {
    return await compare(notEncrypted, encrypted);
  }

  async signUp(userCreationDto: UserCreationDto): Promise<void> {
    const user = await this.usersRepository.createUser(userCreationDto);
    await this.profileRepository.createProfile(user);
  }

  async signIn(userLoginDto: UserLoginDto): Promise<User | undefined> {
    const { nameOrEmail, password } = userLoginDto;
    const user = await this.usersRepository.findByNameOrEmail(nameOrEmail);

    if (user && this.validatePass(password, user.password)) {
      return user;
    }
  }
}
