import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Request,
  UseGuards,
  ForbiddenException,
  Delete,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { UploadPluginVersionDto } from './dto/upload-plugin-version.dto';
import { PluginVersionService } from './plugin-version.service';
import { PluginService } from './plugin.service';
import * as fs from 'node:fs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { Role } from 'src/user/entities/role.enum';
import { UserService } from 'src/user/user.service';

@ApiTags('plugin-versions')
@Controller('plugin-versions')
export class PluginVersionController {
  constructor(
    private readonly pluginVersionService: PluginVersionService,
    private readonly pluginService: PluginService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const pluginVersion = await this.pluginVersionService.findOneById(id);

    if (!pluginVersion) {
      throw new NotFoundException('Plugin version not found');
    }

    return pluginVersion;
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pluginId: { type: 'number', nullable: false },
        version: { type: 'string' },
        description: { type: 'string' },
        gitLink: { type: 'string' },
        beta: { type: 'boolean', default: true },
        pluginFile: {
          type: 'string',
          format: 'binary',
        },
        helpFileEn: {
          type: 'string',
          format: 'binary',
        },
        helpFileRu: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        helpFileKz: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pluginFile', maxCount: 1 },
        { name: 'helpFileEn', maxCount: 1 },
        { name: 'helpFileRu', maxCount: 1 },
        { name: 'helpFileKz', maxCount: 1 },
      ],
      { storage: diskStorage({ destination: './upload' }) },
    ),
  )
  async upload(
    @Request() req,
    @UploadedFiles()
    files: {
      pluginFile: Express.Multer.File[];
      helpFileEn?: Express.Multer.File[];
      helpFileRu?: Express.Multer.File[];
      helpFileKz?: Express.Multer.File[];
    },
    @Body() uploadPluginVersionDto: UploadPluginVersionDto,
  ) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.role != Role.Developer && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const user = await this.userService.findOneById(jwtUser.sub);

    if (!files.pluginFile) {
      if (files.helpFileEn) fs.unlinkSync(files.helpFileEn[0].path);
      if (files.helpFileRu) fs.unlinkSync(files.helpFileRu[0].path);
      if (files.helpFileKz) fs.unlinkSync(files.helpFileKz[0].path);

      throw new BadRequestException('pluginFile should not be empty');
    }

    const plugin = await this.pluginService.findOneById(
      uploadPluginVersionDto.pluginId,
    );

    if (!plugin) {
      throw new NotFoundException('Plugin not found');
    }

    return await this.pluginVersionService.uploadPluginVersion(
      uploadPluginVersionDto,
      plugin,
      user,
      files.pluginFile[0].filename,
      files.helpFileEn?.[0].filename,
      files.helpFileRu?.[0].filename,
      files.helpFileKz?.[0].filename,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    const jwtUser: PayloadDto = req.user;

    const pluginVersion = await this.pluginVersionService.findOneById(id);

    if (!pluginVersion) {
      throw new NotFoundException('plugin version not found');
    }

    if (jwtUser.sub != pluginVersion.author.id && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    fs.unlinkSync(`upload/${pluginVersion.fileName}`);
    if (pluginVersion.helpFileEn)
      fs.unlinkSync(`upload/${pluginVersion.helpFileEn}`);
    if (pluginVersion.helpFileRu)
      fs.unlinkSync(`upload/${pluginVersion.helpFileRu}`);
    if (pluginVersion.helpFileKz)
      fs.unlinkSync(`upload/${pluginVersion.helpFileKz}`);

    return await this.pluginVersionService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('beta/:id')
  async switchBeta(
    @Request() req,
    @Param('id') id: number,
    @Query('flag') flag: string,
  ) {
    if (!flag || (flag != 'true' && flag != 'false')) {
      throw new BadRequestException({
        success: false,
        message: 'invalid value in flag parameter',
      });
    }

    const jwtUser: PayloadDto = req.user;

    const pluginVersion = await this.pluginVersionService.findOneById(id);

    if (!pluginVersion) {
      throw new NotFoundException('plugin version not found');
    }

    if (jwtUser.sub != pluginVersion.author.id && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    let bool = true;
    if (flag == 'false') {
      bool = false;
    }

    return await this.pluginVersionService.switchBeta(pluginVersion, bool);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('deprecated/:id')
  async switchDeprecated(
    @Request() req,
    @Param('id') id: number,
    @Query('flag') flag: string,
  ) {
    if (!flag || (flag != 'true' && flag != 'false')) {
      throw new BadRequestException({
        success: false,
        message: 'invalid value in flag parameter',
      });
    }

    const jwtUser: PayloadDto = req.user;

    const pluginVersion = await this.pluginVersionService.findOneById(id);

    if (!pluginVersion) {
      throw new NotFoundException('plugin version not found');
    }

    if (jwtUser.sub != pluginVersion.author.id && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    let bool = true;
    if (flag == 'false') {
      bool = false;
    }

    if (
      (!pluginVersion.deprecated && !bool) ||
      (pluginVersion.deprecated && bool)
    ) {
      return pluginVersion;
    }

    return await this.pluginVersionService.switchDeprecated(
      pluginVersion,
      bool,
    );
  }
}
