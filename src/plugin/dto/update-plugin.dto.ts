import { CreatePluginDto } from './create-plugin.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdatePluginDto extends PartialType(CreatePluginDto) {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
