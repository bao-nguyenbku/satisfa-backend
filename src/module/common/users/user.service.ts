import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '~/module/common/users/dto/create-user';
import { User, UserDocument } from '~/module/common/users/user.schema';
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
