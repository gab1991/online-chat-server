import { Expose } from 'class-transformer';

import { ChatType } from '../types';

export class ChatDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  type: ChatType;

  @Expose()
  creatorId: number;

  @Expose()
  createdAt: string;
}
