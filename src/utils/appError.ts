export enum ArrErrorCode {
  'username_exist',
  'email_exist',
}

export class AppError extends Error {
  constructor(public appErrCode: ArrErrorCode, message?: string) {
    super(message);
  }
}
