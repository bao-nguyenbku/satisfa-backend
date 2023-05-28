import {
  Injectable,
  NotAcceptableException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from '~/module/common/users/dto/create-user.dto';
import { User, UserDocument } from '~/module/common/users/user.schema';
import { HashService } from './hash.service';

import { UserDataDto } from './dto/response-user';
import { transformResult } from '~/utils';
import { Role } from '~/constants/role.enum';
import * as _ from 'lodash';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly hashService: HashService,
  ) {}

  async findById(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new NotAcceptableException(id + ' is not a valid id');

      const user = await this.userModel.findById(id).lean();
      if (user) {
        const resUser = _.omit(user, ['password', 'role']);
        return transformResult(resUser);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  // !PRIVATE SERVICE
  async findByEmail(email: string) {
    try {
      const existedEmail = await this.userModel.findOne({ email }).lean();
      if (existedEmail) {
        return transformResult(existedEmail);
      }
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, updateData: UpdateUserDto) {
    if (_.has(updateData, 'email') || _.has(updateData, 'role')) {
      throw new BadRequestException('Some field can not be accepted to update');
    }
    try {
      const result = await this.userModel
        .findByIdAndUpdate(id, updateData)
        .select(['-password', '-role'])
        .lean();
      return transformResult(result);
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
      let today = new Date();
      const start = new Date(
        today.setDate(today.getDate() - today.getDay() - 6),
      ).getTime();
      today = new Date();
      const end = new Date(
        today.setDate(today.getDate() - today.getDay()),
      ).getTime();
      const customers = await this.userModel.find({
        role: Role.USER,
      });
      const filterCustomer = customers.filter(
        (item) =>
          new Date(item.createdAt).getTime() >= start &&
          new Date(item.createdAt).getTime() <= end,
      );
      return filterCustomer.length;
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
