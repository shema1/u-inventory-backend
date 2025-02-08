import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsNotEmpty()
  @IsString()
  // @MinLength(2)
  // @MaxLength(50)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsNotEmpty()
  @IsString()
  // @MinLength(2)
  // @MaxLength(50)
  lastName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is too weak',
  // })
  readonly password: string;
}
