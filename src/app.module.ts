import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { MediaModule } from './media/media.module';
// import { ConfigModule } from '@nestjs/config';
// import { ConfigModule } from './config/config.module';
// import { ConfigService } from './config/config.service';
import { ContactModule } from './contact/contact.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.APP_ENV === 'production' ? true : false,
    }),
    // ConfigModule,
    CatsModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    MediaModule,
    // MongooseModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) =>
    //     configService.getMongoConfig(),
    // }),
    MongooseModule.forRoot(process.env.DB_URI),
    ContactModule,
    CategoriesModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
