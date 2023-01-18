import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  swid: string;

  @ManyToOne(() => User, (user) => user.licenses)
  user: User;

  @Column()
  expireDate: Date;

  @Column({ nullable: true })
  hwid?: string;
}
