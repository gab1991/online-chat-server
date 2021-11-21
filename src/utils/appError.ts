export enum ArrErrorCode {
  'username_exist',
  'email_exist',
  'no_entity_found',
}

export class AppError extends Error {
  constructor(public appErrCode: ArrErrorCode, message?: string) {
    super(message);
  }
}
