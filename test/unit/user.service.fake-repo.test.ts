import { injectable } from "inversify";
import { createContainer } from "../../src/di/createContainer";
import { TYPES } from "../../src/types";
import { IUserRepository } from "../../src/repositories/IUserRepository";
import { User } from "../../src/domain/User";
import { IUserService } from "../../src/services/IUserService";

@injectable()
class FakeUserRepository implements IUserRepository {
  private store = new Map<string, User>([
    ["1", { id: "1", name: "Test", email: "t@test.dev" }]
  ]);
  async findAll() { return [...this.store.values()]; }
  async findById(id: string) { return this.store.get(id) ?? null; }
  async create(input: Omit<User, "id">) {
    const u: User = { id: "FAKE", ...input };
    this.store.set(u.id, u);
    return u;
  }
}

describe("UserService (with Fake repo)", () => {
  it("lists users from the fake", async () => {
    const c = createContainer((c) => {
      c.rebind<IUserRepository>(TYPES.UserRepository).to(FakeUserRepository);
    });
    const svc = c.get<IUserService>(TYPES.UserService);
    const all = await svc.list();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe("1");
  });
});
