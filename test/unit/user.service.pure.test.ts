import { injectable } from "inversify";
import { UserService } from "../../src/services/UserService";
import { IUserRepository } from "../../src/repositories/IUserRepository";
import { User } from "../../src/domain/User";

@injectable()
class StubRepo implements IUserRepository {
  async findAll() { return []; }
  async findById(_id: string) { return null; }
  async create(input: Omit<User,"id">) { return { id: "1", ...input }; }
}

it("UserService.create works (pure DI)", async () => {
  const svc = new UserService(new StubRepo());
  const u = await svc.create({ name: "X", email: "x@y.z" });
  expect(u.id).toBe("1");
});
