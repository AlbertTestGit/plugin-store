import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PluginVersion } from './entities/plugin-version.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PluginVersionService {
  constructor(
    @InjectRepository(PluginVersion)
    private pluginVersionRepository: Repository<PluginVersion>,
  ) {}

  async findOneById(id: number) {
    return await this.pluginVersionRepository.findOne({ where: { id } });
  }
}
