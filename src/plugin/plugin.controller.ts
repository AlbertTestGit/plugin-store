import { Controller } from '@nestjs/common';
import { PluginService } from './plugin.service';

@Controller('plugins')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}
}
