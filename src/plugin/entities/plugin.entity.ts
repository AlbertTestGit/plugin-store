import { License } from 'src/license/entities/license.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Plugin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  petrelVersion: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true })
  productKey: string;

  @OneToMany(() => License, (license) => license.user)
  pluginVersions: License[];
}
