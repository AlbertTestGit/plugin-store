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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
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

    if (typeof uploadPluginVersionDto.beta?.valueOf() == 'string') {
      if (uploadPluginVersionDto.beta == 'true')
        uploadPluginVersionDto.beta = true;
      else if (uploadPluginVersionDto.beta == 'false')
        uploadPluginVersionDto.beta = false;
      else {
        throw new BadRequestException('beta must be a boolean value');
      }
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
}
