import { EntityRepository, Repository } from 'typeorm';

import { Message } from './message.entity';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
  async searchMessagesInChats(chatIds: number[], searchStr: string): Promise<Message[]> {
    if (!chatIds.length) {
      return [];
    }

    const builder = this.createQueryBuilder('m')
      .select()
      .andWhere('LOWER(m.message) LIKE LOWER(:searchStr)', {
        searchStr: `%${searchStr}%`,
      })
      .andWhere('m.chatId IN (:...chatIds)', { chatIds });

    const foundMessages = await builder.getMany();

    return foundMessages;
  }
}
