import { Profile } from '../profile.entity';
import { Chat } from 'modules/chat/chat.entity';

export interface DetailedProfile extends Profile {
  username: string;
  email: string;
  chats: Chat[];
}
