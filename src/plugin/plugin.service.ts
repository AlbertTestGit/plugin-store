import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plugin } from './entities/plugin.entity';
import { Repository } from 'typeorm';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PluginService {
  constructor(
    @InjectRepository(Plugin)
    private pluginRepository: Repository<Plugin>,
  ) {}

  async create(createPluginDto: CreatePluginDto) {
    const plugin = new Plugin();
    plugin.name = createPluginDto.name;
    plugin.petrelVersion = createPluginDto.petrelVersion;
    plugin.productKey = uuidv4();

    await this.pluginRepository.save(plugin);
    return plugin;
  }

  async findAll() {
    return await this.pluginRepository.find();
  }

  async findOne(id: number) {
    const plugin = await this.pluginRepository.findOneBy({ id });

    if (!plugin) {
      throw new NotFoundException('Plugin is not found');
    }

    return plugin;
  }

  async update(updatePluginDto: UpdatePluginDto) {
    const plugin = await this.pluginRepository.findOneBy({
      id: updatePluginDto.id,
    });

    if (!plugin) {
      throw new NotFoundException('Plugin is not found');
    }

    Object.assign(plugin, updatePluginDto);
    await this.pluginRepository.save(plugin);
    return plugin;
  }

  async remove(id: number) {
    const plugin = await this.pluginRepository.findOneBy({ id });

    if (!plugin) {
      throw new NotFoundException('Plugin is not found');
    }

    await this.pluginRepository.delete(id);
  }
}
