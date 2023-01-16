import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { PluginModule } from './plugin/plugin.module';
import { LicenseModule } from './license/license.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'qwerty123',
      database: 'plugin-store',
      entities: [User],
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
