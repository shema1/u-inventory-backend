import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MicorsoftUser } from 'src/schemas/micorsoftUser.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async checkUser(user: MicorsoftUser): Promise<User | null> {
    const userExist = await this.getUserByEmail(user.email);
    if (userExist) {
      return userExist;
    } else {
      return await this.createUser({
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
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

  async updateUser(id: string, updateUserDto: Partial<User>): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  // Видалити користувача
  async deleteUser(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
