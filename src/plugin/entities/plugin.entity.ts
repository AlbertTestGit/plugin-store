import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  productKey: string;
}
