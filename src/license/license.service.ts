import { Injectable } from '@nestjs/common';
import { UnpackedTokenDto } from './dto/unpacked-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './entities/license.entity';
import { MoreThan, Repository } from 'typeorm';
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
      swid: 'appkey1 yaya',
      hwid: 'b4b95cea10bbe85138e620694c1d54e6',
      user: '',
      pass: '',
      token:
        'WVhCd2EyVjVNU0I1WVhsaC5iNGI5NWNlYTEwYmJlODUxMzhlNjIwNjk0YzFkNTRlNi4u',
    };
  }

  // TODO: Заглушка
  getLicenseCode(token?: string) {
    return 'SWhBaUZNVENCbWpSSFl1Tk0wQm9VUFJxRU5nVUUrWXNiTmd6TEJrZ2lHcFpXRUozWVRKV05VMVRRalZaV0d4b0xtSTBZamsxWTJWaE1UQmlZbVU0TlRFek9HVTJNakEyT1RSak1XUTFOR1UyTGsxcVFYbE5lVEIzVFZNd2VFMUJQVDB1LkZ5UVhKUFh5UGxycEs3MjFWU01LWU1kVEllOXhjWU1lRHVGVkhpRkQ2dzQ9';
  }

  async getLicenseFromUser(user: User, swid: string) {
    const license = await this.licenseRepository.findOne({
      where: {
        swid,
        user,
        expireDate: MoreThan(new Date()),
      },
    });

    if (!license) {
      return null;
    }

    return license;
  }

  // Выдача лицензии менеджером
  async licenseIssue(swid: string, user: User, count: number) {
    const dateNow = new Date();
    const expireDate = new Date(dateNow.setFullYear(dateNow.getFullYear() + 1));

    const licenses: License[] = [];

    for (let i = 0; i < count; i++) {
      const license = new License();
      license.swid = swid;
      license.user = user;
      license.expireDate = expireDate;

      licenses.push(license);
    }

    await this.licenseRepository.save(licenses);
    return licenses;
  }

  async getLicenses(): Promise<License[]> {
    return await this.licenseRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async getLicense(id: number): Promise<License | null> {
    const license = await this.licenseRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id,
      },
    });

    if (!license) {
      return null;
    }

    return license;
  }

  // TODO: Заглушка
  async updateLicense() {}

  async deleteLicense(id: number) {
    await this.licenseRepository.delete(id);
  }
}
