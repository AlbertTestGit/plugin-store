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

  @Column()
  name: string;

  @Column({ nullable: true })
  developerKey: string;

  @Column()
  petrelVersion: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true })
  productKey: string;
}
