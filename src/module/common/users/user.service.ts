import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from '~/module/common/users/dto/create-user';
import { User, UserDocument } from '~/module/common/users/user.schema';
import { HashService } from './hash.service';

import { UserDataDto } from './dto/response-user';
import { transformResult } from '~/utils';
import { Role } from '~/constants/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly hashService: HashService,
  ) {}

  async findById(id: string) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await this.userModel.findById(id).lean();
        // TODO Handle case product null;
        if (user) {
          const { _id, __v, ...rest } = user;
          return {
            id: _id,
            ...rest,
          };
        }
        return null;
      } else {
        throw new NotAcceptableException('This is not a valid id');
      }
    } catch (error) {
      throw error;
    }
  }
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

  async findAll(): Promise<UserDataDto[]> {
    try {
      const userList = await this.userModel
        .find({ role: Role.USER })
        .select(['-password'])
        .lean();
      return transformResult(userList) as UserDataDto[];
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
