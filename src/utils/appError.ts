export enum ArrErrorCode {
  'username_exist',
  'email_exist',
  'no_entity_found',
  'private_chat_same_participants',
}

export class AppError extends Error {
  constructor(public appErrCode: ArrErrorCode, message?: string) {
    super(message);
  }
}
