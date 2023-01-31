import { Injectable } from '@nestjs/common';
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

  async findOneById(id: number) {
    const plugin = await this.pluginRepository.findOne({
      relations: {
        pluginVersions: true,
      },
      where: {
        id,
      },
    });

    if (!plugin) {
      return null;
    }

    return plugin;
  }

  async findOneByProductKey(productKey: string): Promise<Plugin | null> {
    const plugin = await this.pluginRepository.findOne({
      where: {
        productKey,
      },
    });

    if (!plugin) {
      return null;
    }

    return plugin;
  }

  async findOneByName(name: string) {
    const plugin = await this.pluginRepository.findOne({
      where: {
        name,
      },
    });

    if (!plugin) {
      return null;
    }

    return plugin;
  }

  async update(plugin: Plugin, updatePluginDto: UpdatePluginDto) {
    Object.assign(plugin, updatePluginDto);
    await this.pluginRepository.save(plugin);
    return plugin;
  }

  async remove(id: number) {
    await this.pluginRepository.delete(id);
  }
}
