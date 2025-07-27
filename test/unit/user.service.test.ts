import { createContainer } from "../../src/di/createContainer";
import { TYPES } from "../../src/types";
import { IUserService } from "../../src/services/IUserService";

describe("UserService (container)", () => {
  it("creates a user with valid email", async () => {
    const c = createContainer();
    const svc = c.get<IUserService>(TYPES.UserService);
    const u = await svc.create({ name: "Grace", email: "grace@navy.mil" });
    expect(u.id).toBeTruthy();
    expect(u.email).toBe("grace@navy.mil");
  });

  it("rejects invalid email", async () => {
    const c = createContainer();
    const svc = c.get<IUserService>(TYPES.UserService);
    await expect(svc.create({ name: "X", email: "bad" }))
      .rejects.toMatchObject({ message: "Invalid email" });
  });
});
