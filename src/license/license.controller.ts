import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { OnlineActivateDto } from './dto/online-activate.dto';
import { PluginService } from '../plugin/plugin.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { IssueLicenseDto } from './dto/issue-license.dto';

@ApiTags('licenses')
@Controller('licenses')
export class LicenseController {
  constructor(
    private readonly licenseService: LicenseService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly pluginService: PluginService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('manual-activation/:token')
  async manualActivation(@Request() req, @Param('token') token: string) {
    const user: User = req.user;

    const unpackToken = await this.licenseService.getUnpackToken(token);

    const license = await this.licenseService.getLicenseFromUser(
      user,
      unpackToken.swid,
    );

    if (!license) {
      throw new NotFoundException('You do not have active licenses');
    }

    return license;
  }

  // @Post('automatic-activation')
  // async automaticActivation(@Body() onlineActivateDto: OnlineActivateDto) {
  //   const user = await this.authService.validateUser(
  //     onlineActivateDto.username,
  //     onlineActivateDto.password,
  //   );
  //
  //   if (!user) {
  //     throw new BadRequestException('Incorrect username or password');
  //   }
  //
  //   const unpackToken = this.licenseService.getUnpackToken(
  //     onlineActivateDto.token,
  //   );
  //
  //   const license = await this.licenseService.getLicenseFromUser(
  //     user,
  //     unpackToken.swid,
  //   );
  //
  //   if (!license) {
  //     throw new NotFoundException('You do not have active licenses');
  //   }
  //
  //   return license;
  // }
  //
  // // TODO: только роли менеджер или админ
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async licenseIssue(@Body() issueLicenseDto: IssueLicenseDto) {
  //   const plugin = await this.pluginService.findOneByProductKey(
  //     issueLicenseDto.swid,
  //   );
  //
  //   if (!plugin) {
  //     throw new NotFoundException('Plugin not found');
  //   }
  //
  //   const user = await this.userService.findOne(issueLicenseDto.userId);
  //
  //   if (!user) {
  //     throw new NotFoundException('User is not found');
  //   }
  //
  //   const licenses = await this.licenseService.licenseIssue(
  //     issueLicenseDto.swid,
  //     user,
  //     issueLicenseDto.count ?? 1,
  //   );
  //
  //   licenses.map((license) => delete license.user.licenses);
  //   return licenses;
  // }
  //
  // // TODO: только роли менеджер или админ
  // // @UseGuards(JwtAuthGuard)
  // @Get()
  // async getLicenses() {
  //   return await this.licenseService.getLicenses();
  // }
  //
  // // TODO: только роли менеджер или админ
  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // async deleteLicense(@Param('id') id: number) {
  //   const license = await this.licenseService.getLicense(id);
  //
  //   if (!license) {
  //     throw new NotFoundException('License not found');
  //   }
  //
  //   await this.licenseService.deleteLicense(id);
  // }
}
