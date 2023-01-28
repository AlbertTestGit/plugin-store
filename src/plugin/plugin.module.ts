import { Module } from '@nestjs/common';
import { PluginService } from './plugin.service';
import { PluginController } from './plugin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plugin } from './entities/plugin.entity';
import { PluginVersion } from './entities/plugin-version.entity';
import { PluginVersionController } from './plugin-version.controller';
import { PluginVersionService } from './plugin-version.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plugin, PluginVersion]), UserModule],
  controllers: [PluginController, PluginVersionController],
  providers: [PluginService, PluginVersionService],
  exports: [PluginService],
})
export class PluginModule {}
