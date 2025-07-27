import { User } from "../domain/User";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(input: Omit<User, "id">): Promise<User>;
}
