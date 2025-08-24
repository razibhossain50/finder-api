// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Biodata } from './biodata/biodata.entity';
import { BiodataModule } from './biodata/biodata.module';
import { FavoritesModule } from './favorites/favorites.module';
import { Favorite } from './favorites/favorites.entity';
import { ProfileView } from './biodata/entities/profile-view.entity';
import { UploadModule } from './upload/upload.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Biodata, Favorite, ProfileView],
        autoLoadEntities: true,
        synchronize: false, // Disabled - using migrations instead
        migrations: ['dist/migrations/*.js'],
        migrationsRun: false, // Set to true if you want auto-run migrations on startup
      }),
    }),
    UserModule,
    AuthModule,
    BiodataModule,
    FavoritesModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
