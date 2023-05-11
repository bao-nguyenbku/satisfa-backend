import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from '~/module/common/users/dto/create-user';
import { User, UserDocument } from '~/module/common/users/user.schema';
import { HashService } from './hash.service';

import { UserDataDto } from './dto/response-user';
import { transformResult } from '~/utils';
import { Role } from '~/constants/role.enum';
import * as _ from 'lodash';
import { UserEntity } from './entities/user.entity';

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
        if (user) {
          return transformResult(user);
        }
        return null;
      } else {
        throw new NotAcceptableException('This is not a valid id');
      }
    } catch (error) {
      throw error;
    }
  }
  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const existedEmail = await this.userModel.findOne({ email }).lean();
      if (existedEmail) {
        return transformResult({
          ...existedEmail,
          id: existedEmail._id.toString(),
          role: existedEmail.role as Role,
        });
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
      const createdUser = await new this.userModel(newUser).save();
      return transformResult(
        _.omit(createdUser.toObject(), ['_id', '__v', 'role', 'password']),
      );
    } catch (error) {
      throw error;
    }
  }
  async countCustomer(): Promise<number> {
    try {
      const customers = await this.userModel.countDocuments({
        role: Role.USER,
      });
      return customers;
    } catch (error) {
      throw error;
    }
  }
  async getLastestCustomer(amount?: any): Promise<UserDataDto[]> {
    try {
      const userList = await this.userModel
        .find({ role: Role.USER })
        .select(['-password'])
        .limit(4)
        .lean();
      return transformResult(userList) as UserDataDto[];
    } catch (error) {
      throw error;
    }
  }
}
