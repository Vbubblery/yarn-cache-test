import { BaseError } from "@/objects/errors/BaseError";

export class AuthenticationError extends BaseError {
  constructor(errorCode, message) {
    super(message, true);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
  }
}

export class PasswordResetMismatchError extends BaseError {
  constructor(message) {
    super(message, true);
    this.name = this.constructor.name;
  }
}

export class PasswordResetError extends BaseError {
  constructor(message) {
    super(message, true);
    this.name = this.constructor.name;
  }
}

export class NoUserError extends Error {
  constructor(message) {
    super(message);
  }
}
