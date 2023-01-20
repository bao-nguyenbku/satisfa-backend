import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
    private readonly configService: ConfigService,
  ) {
    if (connection) {
      console.log(
        'Database is ' +
          configService.get(`database.states[${connection.readyState}]`),
      );
    }
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }
  async findAllUser(): Promise<User[]> {
    return this.userModel.find();
  }
  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
}
