export class User {
  public id: string;
  public username: string;
  public name: string;
  public password: string;
  public createdAt: Date;

  static createNew(username: string, name: string, passwordHash: string) {
    const newUser = new User();

    if (username.length < 5) {
      throw new Error('Username must be at least 5 characters long');
    }

    newUser.username = username;
    newUser.password = passwordHash;
    newUser.name = name;
    return newUser;
  }
}
