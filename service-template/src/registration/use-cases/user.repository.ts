import { User } from '../domain/entities/user.entity';

export const UserRepositoryToken = 'UserRepositoryToken';
export interface UserRepository {
  createNew(user: User): Promise<string>;
  findByUsername(username: string): Promise<User | null>;
}
