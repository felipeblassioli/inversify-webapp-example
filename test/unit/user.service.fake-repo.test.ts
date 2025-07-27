import { createContainer } from "../../src/di/createContainer";
import { TYPES } from "../../src/types";
import { IUserRepository } from "../../src/repositories/IUserRepository";
import { IUserService } from "../../src/services/IUserService";
import { User } from "../../src/domain/User";

class FakeUserRepository implements IUserRepository {
  private store = new Map<string, User>([["1", { id: "1", name: "Test", email: "t@test.dev" }]]);
  async findAll() { return [...this.store.values()]; }
  async findById(id: string) { return this.store.get(id) ?? null; }
  async create(input: Omit<User, "id">) {
    const u: User = { id: "FAKE", ...input };
    this.store.set(u.id, u);
    return u;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION A — Bind an INSTANCE (Inversify‑free fake) ← Recommended
//  - No decorators needed; the container will not construct the class.
//  - Lifetime: singleton per container (you control it by re-creating the container).
// ─────────────────────────────────────────────────────────────────────────────

describe("UserService with Fake repo (INSTANCE)", () => {
  it("lists users from the fake", async () => {
    const c = createContainer((c) => {
      const fake = new FakeUserRepository();
      c.rebind<IUserRepository>(TYPES.UserRepository).toConstantValue(fake);
    });
    const svc = c.get<IUserService>(TYPES.UserService);
    const all = await svc.list();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe("1");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// OPTION B — Bind a FACTORY (fresh fake per resolution)
//  - Still no decorators; the container calls your factory.
//  - Use when you want a new fake each resolution (rare for repos, useful for state isolation).
// ─────────────────────────────────────────────────────────────────────────────

describe("UserService with Fake repo (FACTORY)", () => {
  it("lists users from a factory fake", async () => {
    const c = createContainer((c) => {
      c.rebind<IUserRepository>(TYPES.UserRepository)
        .toDynamicValue(() => new FakeUserRepository());
    });
    const svc = c.get<IUserService>(TYPES.UserService);
    const all = await svc.list();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe("1");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// OPTION C — Bind the CLASS (container constructs the fake)
//  - This requires `@injectable()` on the Fake class if the container constructs it.
//  - Works now because the Fake has no constructor deps, but it is brittle.
//  - Prefer A/B if you want your fakes to be Inversify-agnostic.
// ─────────────────────────────────────────────────────────────────────────────

import { injectable } from "inversify";
@injectable()
class InjectableFakeUserRepository extends FakeUserRepository {}

describe("UserService with Fake repo (CLASS)", () => {
  it("lists users from the injectable fake", async () => {
    const c = createContainer((c) => {
      c.rebind<IUserRepository>(TYPES.UserRepository).to(InjectableFakeUserRepository);
    });
    const svc = c.get<IUserService>(TYPES.UserService);
    const all = await svc.list();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe("1");
  });
});