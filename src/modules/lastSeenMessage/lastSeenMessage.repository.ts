import { EntityRepository, Repository } from 'typeorm';

import { LastSeenMsg } from './lastSeenMessage.entity';

@EntityRepository(LastSeenMsg)
export class LastSeenMsgRepository extends Repository<LastSeenMsg> {}
