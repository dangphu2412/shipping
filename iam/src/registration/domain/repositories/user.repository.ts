import { User } from '../entities/user.entity';

export const UserRepository = Symbol('UserRepositoryToken');

export interface UserRepository {
  createNew(user: User): Promise<string>;
  findByUsername(username: string): Promise<User | null>;
}
