import { IsNotEmpty } from 'class-validator';

export class CreatePluginDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  petrelVersion: string;
}
