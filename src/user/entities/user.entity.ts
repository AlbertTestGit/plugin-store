import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { License } from '../../license/entities/license.entity';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ default: Role.User })
  role: Role;

  @Column({ nullable: false })
  passwordHash: string;

  @OneToMany(() => License, (license) => license.user)
  licenses: License[];

  @OneToMany(() => License, (license) => license.user)
  pluginVersions: License[];
}
