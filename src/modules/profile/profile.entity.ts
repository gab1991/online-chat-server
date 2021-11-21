import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Chat } from 'modules/chat/chat.entity';
import { User } from 'modules/user/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: string;

  @Column()
  displayedName: string;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @ManyToMany(() => Chat, (chat) => chat.participants)
  chats: Chat[];
}
