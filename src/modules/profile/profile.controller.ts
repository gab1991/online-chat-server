import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ImgSaver, Serialize } from 'decorators';

import { DetailedProfile } from './types';

import { DetailedProfileDto } from './dto/detailedProfile.dto';
import { GetProfileQuery } from './dto/getProfileQuery.dto';
import { ProfileDto } from './dto/profile.dto';
import { UpdDispNameDto } from './dto/updateDispName.dto';
import { AuthenticatedUser } from 'modules/auth/decorators';
import { JwtAuthGuard } from 'modules/auth/passport/jwt.guard';
import { User } from 'modules/user/user.entity';

import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/mine')
  @UseGuards(JwtAuthGuard)
  @Serialize(DetailedProfileDto)
  async getCurrentUserProfile(@AuthenticatedUser() user: User): Promise<DetailedProfile> {
    const profile = await this.profileService.getProfile(user.id);

    if (!profile) {
      throw new BadRequestException();
    }

    const detailedProfile: DetailedProfile = { ...profile, username: user.name, email: user.email };

    return detailedProfile;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProfile(@Param('id', new ParseIntPipe()) id: number): Promise<Profile | undefined> {
    return this.profileService.getProfile(id);
  }

  @Get('')
  @Serialize(ProfileDto)
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

  @Patch(':id/updateDispName')
  @UseGuards(JwtAuthGuard)
  @Serialize(ProfileDto)
  async updateDistplayedName(
    @Param('id', new ParseIntPipe()) id: number,
    @AuthenticatedUser() user: User,
    @Body() updDispNameDto: UpdDispNameDto
  ): Promise<Profile> {
    const { displayedName } = updDispNameDto;

    if (id !== user.id) {
      throw new UnauthorizedException();
    }
    return await this.profileService.updateDisplayedName(user.id, displayedName);
  }
}
