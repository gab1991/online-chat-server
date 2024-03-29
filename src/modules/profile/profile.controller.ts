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
  async getCurrentUserProfile(@AuthenticatedUser() user: User): Promise<Profile> {
    const profile = await this.profileService.getDetailedProfile(user.profile.id);

    if (!profile) {
      throw new BadRequestException();
    }

    return profile;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProfile(@Param('id', new ParseIntPipe()) id: number): Promise<Profile | undefined> {
    return this.profileService.getProfile(id);
  }

  @Get('')
  @Serialize(ProfileDto)
  @UseGuards(JwtAuthGuard)
  async getProfiles(
    @Query() getProfilesQuery: GetProfileQuery,
    @AuthenticatedUser() user: User
  ): Promise<Profile[]> {
    const profiles = await this.profileService.getProfiles(getProfilesQuery, {
      exceptIds: [user.profile.id],
    });

    return profiles;
  }

  @Post(':id/uploadAvatar')
  @UseGuards(JwtAuthGuard)
  @ImgSaver({ dest: 'avatars' })
  @Serialize(DetailedProfileDto)
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseIntPipe()) id: number,
    @AuthenticatedUser() user: User
  ): Promise<Profile> {
    if (id !== user.profile.id) {
      throw new UnauthorizedException();
    }
    return await this.profileService.updateAvatarUrl(user.profile.id, file.filename);
  }

  @Patch(':id/updateDispName')
  @UseGuards(JwtAuthGuard)
  @Serialize(DetailedProfileDto)
  async updateDistplayedName(
    @Param('id', new ParseIntPipe()) id: number,
    @AuthenticatedUser() user: User,
    @Body() updDispNameDto: UpdDispNameDto
  ): Promise<Profile> {
    const { displayedName } = updDispNameDto;

    if (id !== user.profile.id) {
      throw new UnauthorizedException();
    }
    return await this.profileService.updateDisplayedName(user.profile.id, displayedName);
  }
}
