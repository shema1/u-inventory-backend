import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsMongoId,
  IsString,
  IsEnum,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  roleId?: string;

  @ApiProperty({
    required: false,
    enum: ['active', 'invited', 'pending', 'banned'],
    description: 'User status',
  })
  @IsOptional()
  @IsEnum(['active', 'invited', 'pending', 'banned'])
  status?: 'active' | 'invited' | 'pending' | 'banned';
}
