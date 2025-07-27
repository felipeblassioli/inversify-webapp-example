import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IUserRepository } from "../repositories/IUserRepository";
import { IUserService } from "./IUserService";
import { User } from "../domain/User";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private readonly repo: IUserRepository
  ) {}

  async list(): Promise<User[]> {
    return this.repo.findAll();
  }

  async get(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) {
      const err = new Error(`User ${id} not found`);
      (err as any).status = 404;
      throw err;
    }
    return user;
  }

  async create(input: { name: string; email: string }): Promise<User> {
    if (!input.email || !input.email.includes("@")) {
      const err = new Error("Invalid email");
      (err as any).status = 400;
      throw err;
    }
    return this.repo.create(input);
  }
}
