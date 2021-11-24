import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ImgSaver, Serialize } from 'decorators';

import { GetProfileQuery } from './dto/getProfileQuery.dto';
import { ProfileDto } from './dto/profile.dto';
import { AuthenticatedUser } from 'modules/auth/decorators';
import { JwtAuthGuard } from 'modules/auth/passport/jwt.guard';
import { User } from 'modules/user/user.entity';

import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProfile(@Param('id', new ParseIntPipe()) id: number): Promise<Profile | undefined> {
    return this.profileService.getProfile(id);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  getProfiles(@Query() getProfilesQuery: GetProfileQuery): Promise<Profile[]> {
    return this.profileService.getProfiles(getProfilesQuery);
  }

  @Post(':id/uploadAvatar')
  @UseGuards(JwtAuthGuard)
  @ImgSaver({ dest: 'avatars' })
  @Serialize(ProfileDto)
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseIntPipe()) id: number,
    @AuthenticatedUser() user: User
  ): Promise<Profile> {
    if (id !== user.id) {
      throw new UnauthorizedException();
    }
    return await this.profileService.updateAvatarUrl(user.id, file.filename);
  }
}
