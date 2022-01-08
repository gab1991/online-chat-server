import { Chat } from '../chat.entity';

export enum ChatType {
  'private' = 'private',
  'group' = 'group',
}

export interface ChatDetailed extends Chat {
  avatarUrl: string | null;
}
