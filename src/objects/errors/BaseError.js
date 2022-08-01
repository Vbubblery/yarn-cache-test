export class BaseError extends Error {
  /**
   * The basic Error Object of Flowlity
   * @param {String} message Error message
   * @param {Boolean} popup    Whether show this Error with notification
   */
  constructor(message, popup = true) {
    super(message);
    this.popup = popup;
  }
}
