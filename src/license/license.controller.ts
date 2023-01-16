import { Controller } from '@nestjs/common';
import { LicenseService } from './license.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('license')
@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}
}
