import { PartialType } from '@nestjs/mapped-types';
import { CreatePluginDto } from './create-plugin.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePluginDto extends PartialType(CreatePluginDto) {
  @IsNotEmpty()
  id: number;
}
