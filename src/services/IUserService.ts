import { User } from "../domain/User";

export interface IUserService {
  list(): Promise<User[]>;
  get(id: string): Promise<User>;
  create(input: { name: string; email: string }): Promise<User>;
}
