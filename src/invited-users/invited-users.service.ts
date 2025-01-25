import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InvitedUser,
  InvitedUserDocument,
} from 'src/schemas/invited-user.schema';

@Injectable()
export class InvitedUsersService {
  constructor(
    @InjectModel(InvitedUser.name)
    private invitedUserModel: Model<InvitedUserDocument>,
  ) {}

  // Create
  async create(createUserDto: Partial<InvitedUser>): Promise<InvitedUser> {
    const newUser = new this.invitedUserModel(createUserDto);
    return newUser.save();
  }

  // Read All
  async findAll(): Promise<InvitedUser[]> {
    return this.invitedUserModel.find().exec();
  }

  // Read One
  async findById(id: string): Promise<InvitedUser> {
    const user = await this.invitedUserModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update
  async update(
    id: string,
    updateUserDto: Partial<InvitedUser>,
  ): Promise<InvitedUser> {
    const updatedUser = await this.invitedUserModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Delete
  async delete(id: string): Promise<void> {
    const result = await this.invitedUserModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
