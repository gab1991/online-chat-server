import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChatType } from './types';

import { Message } from 'modules/message/message.entity';
import { Profile } from 'modules/profile/profile.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'varchar' })
  title: string | null;

  @Column()
  type: ChatType;

  @Column()
  creatorId: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToMany(() => Profile, (profile) => profile.chats, { cascade: true })
  @JoinTable()
  participants: Profile[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
