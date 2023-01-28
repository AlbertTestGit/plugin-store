import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class UploadPluginVersionDto {
  @ApiProperty()
  @IsNotEmpty()
  pluginId: number;

  @ApiProperty()
  @IsNotEmpty()
  version: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  gitLink: string;

  @ApiPropertyOptional({ default: true })
  @Optional()
  beta?: boolean | string;
}
