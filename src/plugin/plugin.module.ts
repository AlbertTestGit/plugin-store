import { Module } from '@nestjs/common';
import { PluginService } from './plugin.service';
import { PluginController } from './plugin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plugin } from './entities/plugin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plugin])],
  controllers: [PluginController],
  providers: [PluginService],
  exports: [PluginService],
})
export class PluginModule {}
