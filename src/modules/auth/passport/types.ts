import { Request } from 'express';

import { User } from 'modules/user/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

export interface JsonJwtDecoded {
  _id: number;
  iat: number;
  exp: number;
}
