export class EndpointError extends Error {
  constructor(message) {
    super(message);
  }
}

export default () => {
  throw new EndpointError("Something went wrong.\nPlease contact Flowlity.");
};
