import AppErrorTypes from './types/AppErrorTypes';

interface AppErrorInterface {
  message: string;
  type: AppErrorTypes;
}

class AppError {
  public readonly message: string;

  public readonly type: AppErrorTypes;

  constructor({ message, type }: AppErrorInterface) {
    this.message = message;
    this.type = type;
  }
}

export default AppError;
