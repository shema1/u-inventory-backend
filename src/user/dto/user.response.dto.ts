import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'invited', 'pending', 'banned'],
  })
  status: string;

  @ApiProperty({ example: '2024-03-14T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-14T12:00:00Z',
    nullable: true,
  })
  invitedAt: Date | null;
}
