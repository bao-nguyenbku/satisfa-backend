import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '~/module/common/users/dto/create-user';
import { User, UserDocument } from '~/module/common/users/user.schema';
import { HashService } from './hash.service';
import { UserDataDto } from './dto/response-user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly hashService: HashService,
  ) {}

  async findByEmail(email: string): Promise<User> {
    try {
      const existedEmail = await this.userModel.findOne({ email }).exec();
      if (existedEmail) {
        return existedEmail.toObject();
      }
    } catch (error) {
      throw error;
    }
  }
  async findById(id: string): Promise<User> {
    try {
      const existedUser = await this.userModel.findOne({ _id: id }).exec();
      if (existedUser) {
        return existedUser.toObject();
      }
    } catch (error) {
      throw error;
    }
  }
  async findAll(): Promise<UserDataDto[]> {
    try {
      return this.userModel.find().select(['-password']).lean();
    } catch (error) {
      throw error;
    }
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const existedEmail = await this.findByEmail(createUserDto.email);
      if (existedEmail) {
        throw new NotAcceptableException('The email is existed');
      }
      const hashedPassword = await this.hashService.hashPassword(
        createUserDto.password,
      );
      const newUser = {
        ...createUserDto,
        password: hashedPassword,
      };
      const createdUser = new this.userModel(newUser);
      return createdUser.save();
    } catch (error) {
      throw error;
    }
  }
}
