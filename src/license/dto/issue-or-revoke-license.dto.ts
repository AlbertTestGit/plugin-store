import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IssueOrRevokeLicenseDto {
  @ApiProperty()
  @IsNotEmpty()
  swid: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  count: number;
}
