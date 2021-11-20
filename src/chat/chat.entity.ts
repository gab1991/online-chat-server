import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChatType } from './types';

import { Profile } from 'profile/profile.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  types: ChatType;

  @Column()
  creatorId: number;

  @Column()
  channelId: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => Profile, (profile) => profile.chats)
  @JoinColumn()
  profile: Profile;
}
