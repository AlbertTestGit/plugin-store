import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PluginService } from './plugin.service';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';

@Controller('plugins')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Post()
  async create(@Body() createPluginDto: CreatePluginDto) {
    return await this.pluginService.create(createPluginDto);
  }

  @Get()
  async findAll() {
    return await this.pluginService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.pluginService.findOne(id);
  }

  @Put()
  async update(@Body() updatePluginDto: UpdatePluginDto) {
    return await this.pluginService.update(updatePluginDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.pluginService.remove(id);
  }
}
