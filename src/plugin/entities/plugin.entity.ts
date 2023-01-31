import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PluginVersion } from './plugin-version.entity';

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

  @OneToMany(() => PluginVersion, (pluginVersion) => pluginVersion.plugin)
  pluginVersions: PluginVersion[];
}
