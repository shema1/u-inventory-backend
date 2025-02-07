import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserIdParam {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ObjectId',
  })
  @IsMongoId()
  id: string;
}
