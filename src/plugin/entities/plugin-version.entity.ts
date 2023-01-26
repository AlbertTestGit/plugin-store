import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Plugin } from './plugin.entity';

@Entity()
export class PluginVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: string;

  @Column()
  description: string;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  helpFileEn?: string;

  @Column({ nullable: true })
  helpFileRu?: string;

  @Column({ nullable: true })
  helpFileKz?: string;

  @CreateDateColumn()
  publicationDate: Date;

  @ManyToOne(() => User, (user) => user.pluginVersions)
  author: User;

  @Column()
  gitLink: string;

  @Column({ default: true })
  beta: boolean;

  @Column({ nullable: true })
  deprecated?: Date;

  @ManyToOne(() => Plugin, (plugin) => plugin.pluginVersions)
  plugin: Plugin;
}
