import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { IdeationModule } from './ideation/ideation.module';
import { CopywritingModule } from './copywriting/copywriting.module';
import { VisualDesignModule } from './visual-design/visual-design.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ContentModule } from './content/content.module';
import { ContentIdeationModule } from './content/content-ideation.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: ':memory:',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    IdeationModule,
    CopywritingModule,
    VisualDesignModule,
    SchedulingModule,
    ContentModule,
    ContentIdeationModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}