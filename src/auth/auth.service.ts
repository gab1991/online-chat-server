import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreationDto } from 'src/user/dto/userCreation.dto';
import { UsersRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository
  ) {}

  async signUp(userCreationDto: UserCreationDto): Promise<void> {
    await this.usersRepository.createUser(userCreationDto);
  }
  // createUser
}
