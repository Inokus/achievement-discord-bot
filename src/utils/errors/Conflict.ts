import { StatusCodes } from 'http-status-codes';

export default class Conflict extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.CONFLICT;
  }
}
