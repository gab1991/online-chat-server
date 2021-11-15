import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // @Column({ nullable: true })
  // status: string;

  @CreateDateColumn()
  createdAt: string;

  @Column()
  displayedName: string;

  @Column({ nullable: true })
  avatarUrl: string;
}
