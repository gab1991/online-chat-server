import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { Profile } from 'modules/profile/profile.entity';
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
    return await bcrypt.compare(notEncrypted, encrypted);
  }

  async signUp(userCreationDto: UserCreationDto): Promise<Profile> {
    const { password } = userCreationDto;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      ...userCreationDto,
      password: hashPassword,
    });

    await this.usersRepository.saveUserUnique(user);

    const profile = this.profileRepository.create({ user, displayedName: user.name });

    return await this.profileRepository.save(profile);
  }

  async signIn(userLoginDto: UserLoginDto): Promise<User | undefined> {
    const { nameOrEmail, password } = userLoginDto;
    const user = await this.usersRepository.findByNameOrEmail(nameOrEmail);

    if (user && (await this.validatePass(password, user.password))) {
      return user;
    }
  }
}
