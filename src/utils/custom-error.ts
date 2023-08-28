export class CustomError extends Error {
  constructor(message: string, private type: string) {
    super(message);
    this.name = "CustomError";
  }

  getType(): string {
    return this.type;
  }
}
