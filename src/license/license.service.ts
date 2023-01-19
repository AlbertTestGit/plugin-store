import { Injectable } from '@nestjs/common';
import { UnpackedTokenDto } from './dto/unpacked-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './entities/license.entity';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
  ) {}

  // TODO: Заглушка
  async getUnpackToken(token: string): Promise<UnpackedTokenDto> {
    return {
      // swid: 'appkey1 yaya',
      swid: '0bc62c2e-1147-4cf6-a982-46760bf5bbf7',
      hwid: 'b4b95cea10bbe85138e620694c1d54e6',
      user: '',
      pass: '',
      token:
        'WVhCd2EyVjVNU0I1WVhsaC5iNGI5NWNlYTEwYmJlODUxMzhlNjIwNjk0YzFkNTRlNi4u',
    };
  }

  // TODO: Заглушка
  async getLicenseCode(token: string, expire: string) {
    return 'SWhBaUZNVENCbWpSSFl1Tk0wQm9VUFJxRU5nVUUrWXNiTmd6TEJrZ2lHcFpXRUozWVRKV05VMVRRalZaV0d4b0xtSTBZamsxWTJWaE1UQmlZbVU0TlRFek9HVTJNakEyT1RSak1XUTFOR1UyTGsxcVFYbE5lVEIzVFZNd2VFMUJQVDB1LkZ5UVhKUFh5UGxycEs3MjFWU01LWU1kVEllOXhjWU1lRHVGVkhpRkQ2dzQ9';
  }

  async findLicense(user: User, swid: string, hwid: string) {
    const license = await this.licenseRepository.findOne({
      where: {
        swid,
        user,
        expireDate: MoreThan(new Date()),
        hwid,
      },
    });

    if (license) {
      return license;
    }

    const unusedLicenses = await this.findUnusedLicenses(user, swid);

    if (unusedLicenses.length == 0) {
      return null;
    }

    unusedLicenses[0].hwid = hwid;
    const newLicense = await this.licenseRepository.save(unusedLicenses[0]);

    return newLicense;
  }

  async findUnusedLicenses(user: User, swid: string) {
    return await this.licenseRepository.find({
      where: {
        swid,
        user,
        expireDate: MoreThan(new Date()),
        hwid: IsNull(),
      },
    });
  }

  async licenseIssue(
    swid: string,
    user: User,
    count: number,
    expireDate?: Date,
  ) {
    const dateNow = new Date();
    expireDate =
      expireDate ?? new Date(dateNow.setFullYear(dateNow.getFullYear() + 1));

    const licenses: License[] = [];

    for (let i = 0; i < count; i++) {
      const license = new License();
      license.swid = swid;
      license.user = user;
      license.expireDate = expireDate;

      licenses.push(license);
    }

    return await this.licenseRepository.save(licenses);
  }

  async unusedLicenseRevocation(unusedLicenses: License[], count: number) {
    await this.licenseRepository.delete(
      unusedLicenses.slice(0, count).map((license) => license.id),
    );
  }
}
