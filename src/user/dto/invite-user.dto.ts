import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsMongoId,
} from 'class-validator';

export class InviteUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user to invite',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Role ID for the invited user',
  })
  @IsNotEmpty()
  @IsMongoId()
  roleId: string;
}
