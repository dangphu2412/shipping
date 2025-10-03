import { BusinessException } from '@dnp2412/service-common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v7 as uuid } from 'uuid';

export class User extends AggregateRoot {
  public id: string;
  public username: string;
  public name: string;
  public password: string;
  public createdAt: Date;

  static createNew(username: string, name: string, passwordHash: string) {
    const newUser = new User();

    if (username.length < 5) {
      throw new BusinessException({
        code: 'REGISTRATION_POLICY_FAILED',
        message: 'Username must be at least 5 characters long',
      });
    }

    newUser.id = uuid();
    newUser.username = username;
    newUser.password = passwordHash;
    newUser.name = name;

    // newUser.apply(new UserRegisteredEvent(newUser.id, newUser.username));
    return newUser;
  }
}
