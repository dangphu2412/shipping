import { UserRepository } from '../use-cases/user.repository';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../database/user.entity';
import { User } from '../domain/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly datasource: DataSource) {}

  static toDomain(userEntity: UserEntity): User {
    const user = new User();
    user.id = userEntity.id;
    user.username = userEntity.username;
    user.name = userEntity.name;
    user.password = userEntity.password;
    user.createdAt = userEntity.createdAt;

    return user;
  }

  async createNew(user: User): Promise<string> {
    const insertResult = await this.datasource.manager.insert(UserEntity, {
      username: user.username,
      password: user.password,
      name: user.name,
    });

    return insertResult.identifiers[0].id as string;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.datasource.manager.findOne(UserEntity, {
      where: { username },
    });

    return user ? UserRepositoryImpl.toDomain(user) : null;
  }
}
