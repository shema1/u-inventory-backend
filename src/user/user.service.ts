import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { InviteUserDto } from './dto/invite-user.dto';
import { RolesService } from '../roles/roles.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private rolesService: RolesService,
  ) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().populate('role').exec();
  }

  async getUsersByStatus(status: string): Promise<User[]> {
    return this.userModel.find({ status }).populate('role').exec();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate('role').exec();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id }).populate('role').exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async createUser(createUserDto: Partial<User>): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  private generateInvitationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async inviteUser(inviteUserDto: InviteUserDto): Promise<User> {
    // Verify that role exists
    await this.rolesService.findById(inviteUserDto.roleId);

    const invitationCode = this.generateInvitationCode();
    const invitationCodeExpiresAt = new Date();
    invitationCodeExpiresAt.setHours(invitationCodeExpiresAt.getHours() + 24);

    const user = await this.createUser({
      ...inviteUserDto,
      role: inviteUserDto.roleId as any,
      status: 'invited',
      invitedAt: new Date(),
      invitationCode,
      invitationCodeExpiresAt,
    });

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateData: Partial<User> = { ...updateUserDto };

    // Якщо передано roleId, оновлюємо поле role
    if (updateUserDto.roleId) {
      await this.rolesService.findById(updateUserDto.roleId);
      updateData.role = updateUserDto.roleId as any; // Видаляємо roleId з об'єкту оновлення
    }

    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id: id }, updateData, { new: true })
      .populate('role')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  // Видалити користувача
  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findOneAndDelete({ id }).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
