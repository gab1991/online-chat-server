import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['msgId', 'chatId', 'profileId'], { unique: true })
export class LastSeenMsg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  msgId: number;

  @Column()
  chatId: number;

  @Column()
  profileId: number;
}
