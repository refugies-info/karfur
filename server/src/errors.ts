export class RefactorTodoError extends Error {
  constructor() {
    super("Refactor TODO");
  }
}

export class MustBePopulatedError extends Error {
  constructor(property: string) {
    super(`${property} must be populated`);
  }
}

export class AuthenticationError extends Error { }

export class NotFoundError extends Error { }
