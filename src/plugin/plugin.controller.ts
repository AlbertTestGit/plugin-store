import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PluginService } from './plugin.service';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PayloadDto } from '../auth/dto/payload.dto';
import { Role } from '../user/entities/role.enum';

@ApiTags('plugins')
@Controller('plugins')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createPluginDto: CreatePluginDto) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.role != Role.Developer && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const existPlugin = await this.pluginService.findOneByName(
      createPluginDto.name,
    );

    if (existPlugin) {
      throw new BadRequestException('This name is already taken');
    }

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req, @Body() updatePluginDto: UpdatePluginDto) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.role != Role.Developer && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const plugin = await this.pluginService.findOneById(updatePluginDto.id);

    if (!plugin) {
      throw new NotFoundException('Plugin not found');
    }

    if (
      updatePluginDto.name &&
      (await this.pluginService.findOneByName(updatePluginDto.name))
    ) {
      throw new BadRequestException('This name is already taken');
    }

    return await this.pluginService.update(plugin, updatePluginDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.role != Role.Developer && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const plugin = await this.pluginService.findOneById(id);

    if (!plugin) {
      throw new NotFoundException('Plugin not found');
    }

    return await this.pluginService.remove(id);
  }
}
