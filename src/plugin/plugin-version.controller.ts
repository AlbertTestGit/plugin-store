import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadPluginVersionDto } from './dto/upload-plugin-version.dto';
import { PluginVersionService } from './plugin-version.service';

@ApiTags('plugin-versions')
@Controller('plugin-versions')
export class PluginVersionController {
  constructor(private readonly pluginVersionService: PluginVersionService) {}

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const pluginVersion = await this.pluginVersionService.findOneById(id);

    if (!pluginVersion) {
      throw new NotFoundException('Plugin version not found');
    }

    return pluginVersion;
  }

  @Put()
  async update() {}

  @Delete(':id')
  async remove(@Param('id') id: number) {}

  @Post('upload')
  async upload(@Body() uploadPluginVersionDto: UploadPluginVersionDto) {}

  @Get('download/:id')
  async download(@Param('id') id: number) {}

  @Post(':id/beta')
  async enableBeta(@Param('id') id: number) {}

  @Delete(':id/beta')
  async disableBeta(@Param('id') id: number) {}

  @Post(':id/deprecated')
  async enableDeprecated(@Param('id') id: number) {}

  @Delete(':id/deprecated')
  async disableDeprecated(@Param('id') id: number) {}
}
