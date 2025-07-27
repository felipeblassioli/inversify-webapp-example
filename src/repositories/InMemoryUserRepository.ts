import { injectable } from "inversify";
import { IUserRepository } from "./IUserRepository";
import { User } from "../domain/User";
import { randomUUID } from "crypto";

@injectable()
export class InMemoryUserRepository implements IUserRepository {
  private data: Map<string, User> = new Map([
    ["u1", { id: "u1", name: "Ada Lovelace", email: "ada@example.com" }],
    ["u2", { id: "u2", name: "Alan Turing", email: "alan@example.com" }],
  ]);

  async findAll(): Promise<User[]> {
    return [...this.data.values()];
  }

  async findById(id: string): Promise<User | null> {
    return this.data.get(id) ?? null;
  }

  async create(input: Omit<User, "id">): Promise<User> {
    const id = randomUUID();
    const user: User = { id, ...input };
    this.data.set(id, user);
    return user;
  }
}
