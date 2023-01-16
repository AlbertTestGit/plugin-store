import { Controller } from '@nestjs/common';
import { LicenseService } from './license.service';

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}
}
