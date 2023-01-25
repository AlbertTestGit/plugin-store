import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IssueOrRevokeLicenseDto {
  @ApiProperty()
  @IsNotEmpty()
  swid: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  count: number;
}
