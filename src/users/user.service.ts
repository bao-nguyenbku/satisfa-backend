import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user';
import { User, UserDocument } from '../schemas/user.schema';
import { HashService } from './hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly hashService: HashService,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return (await this.userModel.findOne({ email }).exec()).toObject();
  }
  async findAllUser(): Promise<User[]> {
    return this.userModel.find();
  }
  async create(createUserDto: CreateUserDto) {
    //TODO: Hash password here
    const hashedPassword = await this.hashService.hashPassword(
      createUserDto.password,
    );
    const newUser = {
      ...createUserDto,
      password: hashedPassword,
    };
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }
}
