import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { InviteUserDto } from './dto/invite-user.dto';
import { RolesService } from '../roles/roles.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private rolesService: RolesService,
    private mailService: MailService,
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
    return this.userModel.findById(id).populate('role').exec();
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
    invitationCodeExpiresAt.setHours(invitationCodeExpiresAt.getHours() + 24); // Code expires in 24 hours

    const user = await this.createUser({
      ...inviteUserDto,
      role: inviteUserDto.roleId as any, // Type assertion to avoid type error
      status: 'invited',
      invitedAt: new Date(),
      invitationCode,
      invitationCodeExpiresAt,
    });

    // Send invitation code via email
    await this.mailService.sendInvitationCode(
      user.email,
      invitationCode,
      user.firstName,
    );

    return user;
  }

  async updateUser(id: string, updateUserDto: Partial<User>): Promise<User> {
    if (updateUserDto.role) {
      // Verify that new role exists
      await this.rolesService.findById(updateUserDto.role.toString());
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .populate('role')
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
