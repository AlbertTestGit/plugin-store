import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { License } from './entities/license.entity';
import { PluginModule } from '../plugin/plugin.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([License]),
    AuthModule,
    PluginModule,
    UserModule,
  ],
  controllers: [LicenseController],
  providers: [LicenseService],
})
export class LicenseModule {}
