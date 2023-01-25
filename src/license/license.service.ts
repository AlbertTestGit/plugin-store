import { Injectable } from '@nestjs/common';
import { UnpackedTokenDto } from './dto/unpacked-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './entities/license.entity';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
    private readonly httpService: HttpService,
  ) {}

  // TODO: Hardcode
  async getUnpackToken(token: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`http://192.168.10.46:10100/unpack?token=${token}`)
        .pipe(
          catchError((error) => {
            throw 'An error happened';
          }),
        ),
    );

    return data.data as UnpackedTokenDto;
  }

  // TODO: Hardcode
  async getLicenseCode(token: string, expire: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `http://192.168.10.46:10100/license?token=${token}&expire=${expire}`,
        )
        .pipe(
          catchError((error) => {
            throw 'An error happened';
          }),
        ),
    );

    return data.data as string;
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
