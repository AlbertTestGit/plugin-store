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
  pluginFile: any;

  @ApiPropertyOptional()
  @Optional()
  helpFileEn: any;

  @ApiPropertyOptional()
  @Optional()
  helpFileRu: any;

  @ApiPropertyOptional()
  @Optional()
  helpFileKz: any;

  @ApiProperty()
  @IsNotEmpty()
  gitLink: string;

  @ApiPropertyOptional()
  @Optional()
  beta: boolean;
}
