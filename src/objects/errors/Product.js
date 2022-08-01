import { BaseError } from "@/objects/errors/BaseError";

export class ReadProductError extends BaseError {
  constructor(message) {
    super(message, true);
    this.name = this.constructor.name;
  }
}
