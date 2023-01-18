import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IssueLicenseDto {
  @ApiProperty()
  @IsNotEmpty()
  swid: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  count?: number;
}
