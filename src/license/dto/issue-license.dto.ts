import { IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IssueLicenseDto {
  @ApiProperty()
  @IsNotEmpty()
  swid: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  count: number;
}
