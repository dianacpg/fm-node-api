export class CustomError extends Error {
  constructor(message: string, public type: string) {
    super(message);
  }
}
