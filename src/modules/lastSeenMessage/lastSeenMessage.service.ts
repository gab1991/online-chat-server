import { Injectable } from '@nestjs/common';

import { LastSeenMsg } from './lastSeenMessage.entity';
import { LastSeenMsgRepository } from './lastSeenMessage.repository';

@Injectable()
export class LastSeenMessageService {
  constructor(private lastSeenMessageRepo: LastSeenMsgRepository) {}

  async getLastSeenMsgsByProfileId(profileId: number): Promise<LastSeenMsg[]> {
    return this.lastSeenMessageRepo.find({ where: { profileId } });
  }

  async updateLastSeenMsg(profileId: number, chatId: number, msgId: number): Promise<LastSeenMsg> {
    const existingRecord = await this.lastSeenMessageRepo.findOne({ where: [{ profileId, chatId }] });

    if (existingRecord) {
      return await this.lastSeenMessageRepo.save({ ...existingRecord, msgId });
    }

    const newRecord = this.lastSeenMessageRepo.create({ profileId, chatId, msgId });

    return await this.lastSeenMessageRepo.save(newRecord);
  }
}
