import {
  Column,
  CreateDateColumn,
  Entity,
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
}
