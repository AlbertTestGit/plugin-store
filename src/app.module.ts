import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { PluginModule } from './plugin/plugin.module';
import { LicenseModule } from './license/license.module';
import { Plugin } from './plugin/entities/plugin.entity';
import { License } from './license/entities/license.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PluginVersion } from './plugin/entities/plugin-version.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'qwerty123',
      database: 'plugin-store',
      entities: [User, Plugin, License, PluginVersion],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PluginModule,
    LicenseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
