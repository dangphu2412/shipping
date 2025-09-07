export class LoginUserCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}
