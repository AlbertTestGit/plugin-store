import { Role } from '../../user/entities/role.enum';

export class PayloadDto {
  sub: string;
  username: string;
  role: Role;
}
