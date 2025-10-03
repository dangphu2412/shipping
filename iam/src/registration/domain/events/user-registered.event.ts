export class UserRegisteredEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly username: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
