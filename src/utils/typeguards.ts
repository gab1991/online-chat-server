import { WsResponse } from '@nestjs/websockets';

export const isWebSocketResponse = (res: unknown): res is WsResponse => {
  return res instanceof Object && 'event' in res && 'data' in res;
};
