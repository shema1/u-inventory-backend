import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsEnum } from 'class-validator';
import { Permission } from '../enums/permission.enum';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Administrator role with full access' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: [Permission.UPDATE_ROLE, Permission.READ_USER],
    enum: Permission,
    isArray: true,
  })
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
