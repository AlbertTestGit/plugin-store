import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PluginVersion } from './entities/plugin-version.entity';
import { Repository } from 'typeorm';
import { UploadPluginVersionDto } from './dto/upload-plugin-version.dto';
import { Plugin } from './entities/plugin.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PluginVersionService {
  constructor(
    @InjectRepository(PluginVersion)
    private pluginVersionRepository: Repository<PluginVersion>,
  ) {}

  async findOneById(id: number) {
    return await this.pluginVersionRepository.findOne({ where: { id } });
  }

  async uploadPluginVersion(
    uploadPluginVersionDto: UploadPluginVersionDto,
    plugin: Plugin,
    user: User,
    pluginFileName: string,
    helpEnFileName?: string,
    helpRuFileName?: string,
    helpKzFileName?: string,
  ) {
    const pluginVersion = new PluginVersion();
    pluginVersion.version = uploadPluginVersionDto.version;
    pluginVersion.description = uploadPluginVersionDto.description;
    pluginVersion.fileName = pluginFileName;
    pluginVersion.helpFileEn = helpEnFileName;
    pluginVersion.helpFileRu = helpRuFileName;
    pluginVersion.helpFileKz = helpKzFileName;
    pluginVersion.author = user;
    pluginVersion.gitLink = uploadPluginVersionDto.gitLink;
    pluginVersion.beta = uploadPluginVersionDto.beta as boolean;
    pluginVersion.plugin = plugin;

    return await this.pluginVersionRepository.save(pluginVersion);
  }
}
