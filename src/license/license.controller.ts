import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PluginService } from '../plugin/plugin.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { PayloadDto } from '../auth/dto/payload.dto';
import { Role } from '../user/entities/role.enum';
import { IssueOrRevokeLicenseDto } from './dto/issue-or-revoke-license.dto';

@ApiTags('licenses')
@Controller('licenses')
export class LicenseController {
  constructor(
    private readonly licenseService: LicenseService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly pluginService: PluginService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('manual-activation/:token')
  async manualActivation(@Request() req, @Param('token') token: string) {
    const jwtUser: PayloadDto = req.user;
    const user = await this.userService.findOneById(jwtUser.sub);

    const unpackToken = await this.licenseService.getUnpackToken(token);

    const license = await this.licenseService.findLicense(
      user,
      unpackToken.swid,
      unpackToken.hwid,
    );

    if (!license) {
      throw new NotFoundException('You do not have active licenses');
    }

    const expire = license.expireDate.toISOString().substr(0, 10);
    return {
      licenseCode: await this.licenseService.getLicenseCode(token, expire),
      expire,
    };
  }

  @Get('automatic-activation')
  async automaticActivation(@Query('token') token: string) {
    const unpackToken = await this.licenseService.getUnpackToken(token);
    const user = await this.authService.validateUser(
      unpackToken.user,
      unpackToken.pass,
    );

    if (!user) {
      throw new BadRequestException('Incorrect username or password');
    }

    const license = await this.licenseService.findLicense(
      user,
      unpackToken.swid,
      unpackToken.hwid,
    );

    if (!license) {
      throw new NotFoundException('You do not have active licenses');
    }

    const expire = license.expireDate.toISOString().substr(0, 10);
    return {
      licenseCode: await this.licenseService.getLicenseCode(token, expire),
      expire,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async issueOrRevokeLicense(
    @Request() req,
    @Body() issueOrRevokeLicenseDto: IssueOrRevokeLicenseDto,
  ) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.role != Role.Manager && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const plugin = await this.pluginService.findOneByProductKey(
      issueOrRevokeLicenseDto.swid,
    );
    if (!plugin) {
      throw new NotFoundException('Plugin not found');
    }

    const user = await this.userService.findOneById(
      issueOrRevokeLicenseDto.userId,
    );
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const unusedLicenses = await this.licenseService.findUnusedLicenses(
      user,
      issueOrRevokeLicenseDto.swid,
    );

    const delta = issueOrRevokeLicenseDto.count - unusedLicenses.length;

    if (delta < 0) {
      await this.licenseService.unusedLicenseRevocation(unusedLicenses, -delta);
    } else {
      await this.licenseService.licenseIssue(
        issueOrRevokeLicenseDto.swid,
        user,
        delta,
      );
    }

    return issueOrRevokeLicenseDto;
  }

  @Get()
  async getLicensesCount(@Request() req, @Query('userId') userId: number) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const plugins = await this.pluginService.findAll();

    return await this.licenseService.userLicenses(user, plugins);
  }
}
