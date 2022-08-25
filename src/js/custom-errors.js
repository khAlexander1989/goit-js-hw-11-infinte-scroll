export class notFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'notFoundError';
  }
}

export class dataLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'dataLimitError';
  }
}
