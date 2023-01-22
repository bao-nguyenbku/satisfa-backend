import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { ConfigModule } from '@nestjs/config';
// import { DatabaseModule } from 'src/database/database.module';
// import { usersProviders } from './user.providers';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UserController } from './user.controller';
import { HashService } from './hash.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [UsersService, HashService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}