import { EntityRepository, Repository } from 'typeorm';

import { ChatType } from './types';

import { Chat } from './chat.entity';

interface ICommonChatQueryResult {
  id: number;
  count: string;
}

@EntityRepository(Chat)
export class ChatsRepository extends Repository<Chat> {
  async findCommonChats(participantIds: number[]): Promise<ICommonChatQueryResult[]> {
    const builder = this.createQueryBuilder('c');

    const commonChats: ICommonChatQueryResult[] = await builder
      .innerJoinAndSelect('c.participants', 'p')
      .andWhere('c.type = :chatType', { chatType: ChatType.private })
      .andWhere('p.id IN (:...participantIds)', { participantIds })
      .select('c.id , COUNT(*)')
      .groupBy('c.id')
      .having('COUNT(*) > 1')
      .getRawMany();

    return commonChats;
  }
}
