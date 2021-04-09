export class AuthFailed extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class PermissionDenied extends Error {
  constructor(message: string) {
    super(message);
  }
}
