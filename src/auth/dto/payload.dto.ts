import { Role } from '../../user/entities/role.enum';

export class PayloadDto {
  sub: number;
  username: string;
  role: Role;
}
