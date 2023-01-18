import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { License } from '../../license/entities/license.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: false })
  passwordHash: string;

  @OneToMany(() => License, (license) => license.user)
  licenses: License[];
}
