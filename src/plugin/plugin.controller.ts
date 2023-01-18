import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PluginService } from './plugin.service';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('plugins')
@Controller('plugins')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Post()
  async create(@Body() createPluginDto: CreatePluginDto) {
    return await this.pluginService.create(createPluginDto);
  }

  @Get()
  async getAll() {
    return await this.pluginService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const plugin = await this.pluginService.findOneById(id);

    if (!plugin) {
      throw new NotFoundException('Plugin not found');
    }

    return plugin;
  }

  @Put()
  async update(@Body() updatePluginDto: UpdatePluginDto) {
    const plugin = await this.pluginService.findOneById(updatePluginDto.id);

    if (!plugin) {
      throw new NotFoundException('Plugin not found');
    }

    return await this.pluginService.update(plugin, updatePluginDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const plugin = await this.pluginService.findOneById(id);

    if (!plugin) {
      throw new NotFoundException('Plugin not found');
    }

    return await this.pluginService.remove(id);
  }
}
