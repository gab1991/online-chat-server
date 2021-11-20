import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Chat } from 'chat/chat.entity';
import { User } from 'user/user.entity';

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

  @OneToMany(() => Chat, (chat) => chat.profile)
  chats: Chat[];
}
