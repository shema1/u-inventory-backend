import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MicorsoftUserDto } from 'src/dto/user/micorsof-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUsersByStatus(status: string): Promise<User[]> {
    return this.userModel.find({ status }).exec();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async checkUser(user: MicorsoftUserDto): Promise<User | null> {
    const userExist = await this.getUserByEmail(user.email);
    if (userExist && userExist.status === 'active') {
      return userExist;
    } else {
      return await this.createUser({
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
        // status: 'active',
      });
    }
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async createUser(createUserDto: Partial<User>): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  // async inviteUser(createUserDto: Partial<User>): Promise<User> {
  //   const newUser = await this.createUser();
  //   return newUser.save();
  // }

  async updateUser(id: string, updateUserDto: Partial<User>): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  // Видалити користувача
  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
